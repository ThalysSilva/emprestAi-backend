import { HttpException } from '@nestjs/common';

export type AppErrorProps = {
  message: string;
  statusCode: number;
  action: string;
  details?: Record<string, unknown>;
  saveLog?: boolean;
};

export class ApplicationError extends HttpException {
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly action: string;
  public readonly saveLog: boolean;

  constructor({
    message,
    statusCode,
    details,
    action,
    saveLog = true,
  }: AppErrorProps) {
    super(message, statusCode);
    this.statusCode = statusCode;
    this.action = action;
    this.details = details;
    this.saveLog = saveLog;
  }
}

export class BadRequestError extends ApplicationError {
  constructor(applicationError: Omit<AppErrorProps, 'statusCode'>) {
    super({
      ...applicationError,
      statusCode: 400,
    });
  }
}

export class ConflictRequestError extends ApplicationError {
  constructor(applicationError: Omit<AppErrorProps, 'statusCode'>) {
    super({
      ...applicationError,
      statusCode: 409,
    });
  }
}

export class InternalServerError extends ApplicationError {
  constructor(applicationError: Omit<AppErrorProps, 'statusCode'>) {
    super({ statusCode: 500, ...applicationError });
  }
}

export class NotAuthorizedError extends ApplicationError {
  constructor(applicationError: Omit<AppErrorProps, 'statusCode'>) {
    super({ statusCode: 401, ...applicationError });
  }
}

export class NotFoundError extends ApplicationError {
  constructor(applicationError: Omit<AppErrorProps, 'statusCode'>) {
    super({ statusCode: 404, ...applicationError });
  }
}

export class NotProcessableError extends ApplicationError {
  constructor(applicationError: Omit<AppErrorProps, 'statusCode'>) {
    super({ statusCode: 422, ...applicationError });
  }
}
