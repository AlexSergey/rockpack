import { BaseError } from './_BaseError';
import type { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { USER_NOT_FOUND } from '../constants/messages';

export class UserNotFound extends BaseError implements ErrorInterface {
  public code = USER_NOT_FOUND.code;

  public statusCode = USER_NOT_FOUND.statusCode;

  public message = USER_NOT_FOUND.message;

  public status = getStatus(USER_NOT_FOUND.statusCode);
}
