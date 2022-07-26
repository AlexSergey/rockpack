import { TOKEN_EXPIRED } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class ExpiredTokenError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'ExpiredTokenError';
  }

  public code = TOKEN_EXPIRED.code;

  public statusCode = TOKEN_EXPIRED.statusCode;

  public message = TOKEN_EXPIRED.message;

  public status = getStatus(TOKEN_EXPIRED.statusCode);
}
