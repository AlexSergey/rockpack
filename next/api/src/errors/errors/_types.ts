// eslint-disable-next-line check-file/filename-naming-convention
import { Statuses } from '../utils/get-status';

export interface ErrorInterface {
  code: string;
  message: string;
  status: Statuses;
  statusCode: number;
}
