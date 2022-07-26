import { UNAUTHORIZED } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class UnauthorizedError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'UnauthorizedError';
  }

  public code = UNAUTHORIZED.code;

  public statusCode = UNAUTHORIZED.statusCode;

  public message = UNAUTHORIZED.message;

  public status = getStatus(UNAUTHORIZED.statusCode);
}
