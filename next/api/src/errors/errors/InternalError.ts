import { BaseError } from './_BaseError';
import type { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { INTERNAL_ERROR } from '../constants/messages';

export class InternalError extends BaseError implements ErrorInterface {
  public code = INTERNAL_ERROR.code;

  public statusCode = INTERNAL_ERROR.statusCode;

  public message = INTERNAL_ERROR.message;

  public status = getStatus(INTERNAL_ERROR.statusCode);
}
