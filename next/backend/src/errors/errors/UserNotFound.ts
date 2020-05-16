import { USER_NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class UserNotFound extends Error implements ErrorInterface {
  public code = USER_NOT_FOUND.code;

  public statusCode = USER_NOT_FOUND.statusCode;

  public message = USER_NOT_FOUND.message;

  public status = getStatus(USER_NOT_FOUND.statusCode);
}
