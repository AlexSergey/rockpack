import { BaseError } from './_BaseError';
import type { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { UNAUTHORIZED } from '../constants/messages';

export class Unauthorized extends BaseError implements ErrorInterface {
  public code = UNAUTHORIZED.code;

  public statusCode = UNAUTHORIZED.statusCode;

  public message = UNAUTHORIZED.message;

  public status = getStatus(UNAUTHORIZED.statusCode);
}
