import type { ErrorInterface } from './_types';

import { INTERNAL_ERROR } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class InternalError extends BaseError implements ErrorInterface {
  public code = INTERNAL_ERROR.code;

  public message = INTERNAL_ERROR.message;

  public status = getStatus(INTERNAL_ERROR.statusCode);

  public statusCode = INTERNAL_ERROR.statusCode;

  constructor() {
    super();
    this.name = 'InternalError';
  }
}
