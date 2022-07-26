import { INTERNAL_ERROR } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class InternalError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'InternalError';
  }

  public code = INTERNAL_ERROR.code;

  public statusCode = INTERNAL_ERROR.statusCode;

  public message = INTERNAL_ERROR.message;

  public status = getStatus(INTERNAL_ERROR.statusCode);
}
