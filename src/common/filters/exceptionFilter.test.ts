import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from 'src/modules/global/logs/log.service';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { mock } from 'jest-mock-extended';
import { ApplicationError } from '../applicationError';
import { ExceptionFilterTreatment } from './exceptionFilter';

const logServiceMock = mock<LogService>();
const createMockArgumentsHost = () => {
  const request = mock<Request>();
  const response = mock<Response>();
  const next = mock<NextFunction>();
  response.status.mockImplementation((statusCode: number) => ({
    ...response,
    statusCode,
  }));
  response.json.mockImplementation((data: any) => data);

  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
      getNext: () => next,
    }),
    switchToRpc: () => ({
      getData: () => ({}),
      getContext: () => ({}),
    }),
  } as unknown as ArgumentsHost;
};

describe('ExceptionFilterTreatment', () => {
  let filter: ExceptionFilterTreatment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExceptionFilterTreatment,
        { provide: LogService, useValue: logServiceMock },
      ],
    }).compile();

    filter = module.get<ExceptionFilterTreatment>(ExceptionFilterTreatment);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should catch and handle ApplicationError', async () => {
    const exception = new ApplicationError({
      message: 'Test message',
      statusCode: HttpStatus.BAD_REQUEST,
      action: 'TestService.testAction',
      saveLog: true,
    });
    const host = createMockArgumentsHost();

    await filter.catch(exception, host);

    expect(logServiceMock.error).toHaveBeenCalledTimes(1);
    expect(logServiceMock.error).toHaveBeenCalledWith({
      message: exception.message,
      action: exception.action,
      details: {
        statusCode: exception.statusCode,
        stack: expect.any(String),
      },
    });
  });

  it('should catch and handle HttpException', async () => {
    const exception = new HttpException('Test message', HttpStatus.BAD_REQUEST);
    const host = createMockArgumentsHost();

    await filter.catch(exception, host);

    expect(logServiceMock.error).toHaveBeenCalledTimes(1);
    expect(logServiceMock.error).toHaveBeenCalledWith({
      message: 'Test message',
      action: 'desconhecida',
      details: {
        statusCode: HttpStatus.BAD_REQUEST,
        exception,
        stack: exception.stack,
        exceptionName: exception.name,
        cause: exception.cause,
      },
    });
  });

  it('should catch and handle unknown errors', async () => {
    const exception = new Error('Test message');
    const host = createMockArgumentsHost();

    await filter.catch(exception, host);

    expect(logServiceMock.error).toHaveBeenCalledTimes(1);
    expect(logServiceMock.error).toHaveBeenCalledWith({
      message: exception.message,
      action: exception.stack,
      details: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        exception,
        exceptionName: exception.name,
      },
    });
  });
});
