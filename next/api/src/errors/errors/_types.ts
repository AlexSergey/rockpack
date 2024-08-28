// eslint-disable-next-line check-file/filename-naming-convention
import { Statuses } from '../utils/get-status';

export interface IError {
  code: string;
  message: string;
  status: Statuses;
  statusCode: number;
}
