import { TOKEN_EXPIRED } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class ExpiredToken extends Error implements ErrorInterface {
  public code = TOKEN_EXPIRED.code;

  public statusCode = TOKEN_EXPIRED.statusCode;

  public message = TOKEN_EXPIRED.message;

  public status = getStatus(TOKEN_EXPIRED.statusCode);
}
