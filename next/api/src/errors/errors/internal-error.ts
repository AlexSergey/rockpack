import type { IError } from './_types';

import { INTERNAL_ERROR } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class InternalError extends BaseError implements IError {
  public code = INTERNAL_ERROR.code;

  public message = INTERNAL_ERROR.message;

  public status = getStatus(INTERNAL_ERROR.statusCode);

  public statusCode = INTERNAL_ERROR.statusCode;

  constructor() {
    super();
    this.name = 'InternalError';
  }
}
