import { BAD_REQUEST } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class ErrorProxyError extends BaseError implements IError {
  public code = BAD_REQUEST.code;

  public statusCode = BAD_REQUEST.statusCode;

  public message = BAD_REQUEST.message;

  public status = getStatus(BAD_REQUEST.statusCode);

  constructor(e: IError) {
    super();
    this.name = 'ErrorProxyError';

    if (e instanceof BaseError) {
      this.code = e.code;
      this.statusCode = e.statusCode;
      this.status = e.status;
      this.message = e.message;
    }
  }
}
