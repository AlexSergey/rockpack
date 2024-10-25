import type { ErrorInterface } from './_types';

import { TOKEN_EXPIRED } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class ExpiredTokenError extends BaseError implements ErrorInterface {
  public code = TOKEN_EXPIRED.code;

  public message = TOKEN_EXPIRED.message;

  public status = getStatus(TOKEN_EXPIRED.statusCode);

  public statusCode = TOKEN_EXPIRED.statusCode;

  constructor() {
    super();
    this.name = 'ExpiredTokenError';
  }
}
