import type { ErrorInterface } from './_types';

import { UNAUTHORIZED } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class UnauthorizedError extends BaseError implements ErrorInterface {
  public code = UNAUTHORIZED.code;

  public message = UNAUTHORIZED.message;

  public status = getStatus(UNAUTHORIZED.statusCode);

  public statusCode = UNAUTHORIZED.statusCode;

  constructor() {
    super();
    this.name = 'UnauthorizedError';
  }
}
