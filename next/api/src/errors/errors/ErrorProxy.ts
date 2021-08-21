import { BaseError } from './_BaseError';
import type { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { BAD_REQUEST } from '../constants/messages';

export class ErrorProxy extends BaseError implements ErrorInterface {
  public code = BAD_REQUEST.code;

  public statusCode = BAD_REQUEST.statusCode;

  public message = BAD_REQUEST.message;

  public status = getStatus(BAD_REQUEST.statusCode);

  constructor(e: ErrorInterface) {
    super();

    if (e instanceof BaseError) {
      this.code = e.code;
      this.statusCode = e.statusCode;
      this.status = e.status;
      this.message = e.message;
    }
  }
}
