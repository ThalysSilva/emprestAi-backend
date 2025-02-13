import { Test, TestingModule } from '@nestjs/testing';
import { LogProps, LogService } from './log.service';
import { LogsRepository } from 'src/repositories/logRepository';
import { Logger } from '@nestjs/common';

jest.mock('moment-timezone', () => {
  const m = {
    tz: jest.fn().mockReturnThis(),
    format: jest.fn().mockReturnValue('2025-02-09T00:00:00Z'),
  };
  return jest.fn(() => m);
});

jest.mock('src/utils/functions/objects', () => ({
  normalizeKeys: jest.fn((obj) => obj),
  removeLoops: jest.fn((obj) => obj),
}));

class MockLogger {
  log = jest.fn();
  error = jest.fn();
  warn = jest.fn();
}

describe('LogService', () => {
  let service: LogService;
  let logsRepository: LogsRepository;
  let mockLogger: MockLogger;

  beforeEach(async () => {
    mockLogger = new MockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: LogsRepository,
          useValue: {
            createLog: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
    logsRepository = module.get<LogsRepository>(LogsRepository);
  });

  describe('log', () => {
    it('should log a message and save it to the repository', async () => {
      const logProps: LogProps = {
        message: 'Test message',
        type: 'INFO',
        details: { key: 'value' },
        action: 'TestService.testAction',
      };

      const expectedPayload = {
        ...logProps,
        createdAt: '2025-02-09T00:00:00Z',
        details: logProps.details,
      };

      await service.log(logProps);

      expect(logsRepository.createLog).toHaveBeenCalledWith(expectedPayload);
    });

    it('should log a message to the console if displayOnConsole is true', async () => {
      const logProps: LogProps = {
        message: 'Test message',
        type: 'ERROR',
        details: { key: 'value' },
        displayOnConsole: true,
        action: 'TestService.testAction',
      };

      await service.log(logProps);

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(logProps.message);
    });
  });

  describe('info', () => {
    it('should log an info message', async () => {
      const logProps: Omit<LogProps, 'type'> = {
        message: 'Info message',
        details: { key: 'value' },
        action: 'TestService.testAction',
      };

      const logSpy = jest.spyOn(service, 'log');

      await service.info(logProps);

      expect(mockLogger.error).toHaveBeenCalledTimes(0);
      expect(mockLogger.warn).toHaveBeenCalledTimes(0);
      expect(logSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('should log an error message', async () => {
      const logProps: Omit<LogProps, 'type'> = {
        message: 'Error message',
        details: { key: 'value' },
        action: 'TestService.testAction',
      };

      await service.error(logProps);

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(logProps.message);
    });
  });

  describe('warn', () => {
    it('should log a warning message', async () => {
      const logProps: Omit<LogProps, 'type'> = {
        message: 'Warning message',
        details: { key: 'value' },
        action: 'TestService.testAction',
      };

      await service.warn(logProps);

      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(logProps.message);
    });
  });
});
