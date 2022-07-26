import { Statuses } from '../utils/get-status';

export interface IError {
  statusCode: number;
  message: string;
  code: string;
  status: Statuses;
}
