import type { IError } from './_types';

import { BAD_REQUEST } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class BadRequestError extends BaseError implements IError {
  public code = BAD_REQUEST.code;

  public message = BAD_REQUEST.message;

  public status = getStatus(BAD_REQUEST.statusCode);

  public statusCode = BAD_REQUEST.statusCode;

  constructor() {
    super();
    this.name = 'BadRequestError';
  }
}
