import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApplicationError } from '../applicationError';
import { LogService } from 'src/modules/global/logs/log.service';

@Catch()
export class ExceptionFilterTreatment implements ExceptionFilter {
  constructor(@Inject(LogService) private readonly logService: LogService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ApplicationError) {
      const { message, statusCode, details, action, saveLog, stack } =
        exception;

      const payload = {
        message,
        action,
        details: {
          ...details,
          statusCode,
          stack,
        },
      };

      if (saveLog) {
        await this.logService.error(payload);
      }

      return response.status(statusCode).json({
        error: { message, action },
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse() as
        | string
        | { message: string };
      const message =
        typeof responseBody === 'string' ? responseBody : responseBody.message;
      const isBadRequest = exception instanceof BadRequestException;
      const isUnauthorized = exception instanceof UnauthorizedException;

      if (!isBadRequest && !isUnauthorized) {
        await this.logService.error({
          message,
          action: 'desconhecida',
          details: {
            statusCode: status,
            exception,
            stack: exception.stack,
            exceptionName: exception.name,
            cause: exception.cause,
          },
        });
      }

      return response.status(status).json({
        error: { message: message },
      });
    }

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof Error) {
      const message = exception.message ?? 'Erro desconhecido';
      const action = exception.stack ?? 'desconhecida';

      await this.logService.error({
        message,
        action,
        details: {
          statusCode,
          exception,
          exceptionName: exception.name,
        },
      });

      return response.status(statusCode).json({
        error: {
          message: `Erro interno do servidor: ${message}`,
        },
      });
    }

    await this.logService.error({
      message: 'erro desconhecido',
      action: 'desconhecida',
      details: {
        statusCode,
        exception,
      },
    });

    return response.status(statusCode).json({
      error: {
        message: `Erro interno do servidor`,
      },
    });
  }
}
