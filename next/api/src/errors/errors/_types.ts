import { Statuses } from '../utils/get-status';

export interface IError {
  code: string;
  message: string;
  status: Statuses;
  statusCode: number;
}
