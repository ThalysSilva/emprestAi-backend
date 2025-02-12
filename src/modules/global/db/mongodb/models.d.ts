import { ObjectId } from 'mongodb';
import { LogType } from '@/@entities/log';

export type LogsModel = {
  _id?: ObjectId;
  message: string;
  details: string;
  action: string;
  type: LogType;
  createdAt: string;
};
