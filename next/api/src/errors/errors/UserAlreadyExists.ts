import { BaseError } from './_BaseError';
import { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { USER_ALREADY_EXISTS } from '../constants/messages';

export class UserAlreadyExists extends BaseError implements ErrorInterface {
  public code = USER_ALREADY_EXISTS.code;

  public statusCode = USER_ALREADY_EXISTS.statusCode;

  public message = USER_ALREADY_EXISTS.message;

  public status = getStatus(USER_ALREADY_EXISTS.statusCode);
}
