import { USER_ALREADY_EXISTS } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class UserAlreadyExists extends Error implements ErrorInterface {
  public code = USER_ALREADY_EXISTS.code;

  public statusCode = USER_ALREADY_EXISTS.statusCode;

  public message = USER_ALREADY_EXISTS.message;

  public status = getStatus(USER_ALREADY_EXISTS.statusCode);
}
