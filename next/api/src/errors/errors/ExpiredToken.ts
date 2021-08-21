import { BaseError } from './_BaseError';
import type { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { TOKEN_EXPIRED } from '../constants/messages';

export class ExpiredToken extends BaseError implements ErrorInterface {
  public code = TOKEN_EXPIRED.code;

  public statusCode = TOKEN_EXPIRED.statusCode;

  public message = TOKEN_EXPIRED.message;

  public status = getStatus(TOKEN_EXPIRED.statusCode);
}
