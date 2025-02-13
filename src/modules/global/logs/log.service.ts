import { Injectable, Logger } from '@nestjs/common';
import { OptionalNullable } from 'src/utils/types';
import * as moment from 'moment-timezone';
import { Log, LogType } from 'src/@entities/log';
import { LogsRepository } from 'src/repositories/logRepository';
import { normalizeKeys, removeLoops } from 'src/utils/functions/objects';

export type LogProps = Omit<
  OptionalNullable<Log>,
  'id' | 'createdAt' | 'details'
> &
  Partial<{
    details: Record<string, unknown>;
    detailsFormat?: 'json' | 'string';
    displayOnConsole?: boolean;
  }>;

@Injectable()
export class LogService {
  constructor(
    private readonly logsRepository: LogsRepository,
    private readonly logger: Logger,
  ) {}

  async log({
    displayOnConsole = false,
    detailsFormat = 'json',
    type,
    ...log
  }: LogProps) {
    const selectionLogSystemObject = {
      INFO: this.logger.log.bind(this.logger),
      ERROR: this.logger.error.bind(this.logger),
      WARN: this.logger.warn.bind(this.logger),
    } as Record<LogType, (message: string) => void>;
    const selectedLogFunctionSystem = selectionLogSystemObject[type];

    const normalizedDetails = normalizeKeys(removeLoops(log.details));
    const createdAt = moment().tz('America/Sao_Paulo').format();
    const keepFormat = detailsFormat === 'json';
    const details = keepFormat
      ? normalizedDetails
      : JSON.stringify(normalizedDetails);
    const payload: Omit<Log, 'id'> = {
      ...log,
      type,
      createdAt,
      details,
    };
    if (displayOnConsole) selectedLogFunctionSystem(payload.message);

    await this.logsRepository.createLog(payload);
  }

  async info(log: Omit<LogProps, 'type'>) {
    await this.log({
      type: 'INFO',
      ...log,
    });
  }

  async error(log: Omit<LogProps, 'type'>) {
    await this.log({
      type: 'ERROR',
      displayOnConsole: true,
      ...log,
    });
  }

  async warn(log: Omit<LogProps, 'type'>) {
    await this.log({
      type: 'WARN',
      displayOnConsole: true,
      ...log,
    });
  }
}
