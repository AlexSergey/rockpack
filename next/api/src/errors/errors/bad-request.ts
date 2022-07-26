import { BAD_REQUEST } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class BadRequestError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'BadRequestError';
  }

  public code = BAD_REQUEST.code;

  public statusCode = BAD_REQUEST.statusCode;

  public message = BAD_REQUEST.message;

  public status = getStatus(BAD_REQUEST.statusCode);
}
