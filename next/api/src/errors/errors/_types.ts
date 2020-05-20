import { Statuses } from '../utils/getStatus';

export interface ErrorInterface {
  statusCode: number;
  message: string;
  code: string;
  status: Statuses;
}
