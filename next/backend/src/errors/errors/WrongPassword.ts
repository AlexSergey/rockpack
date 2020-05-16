import { WRONG_PASSWORD } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class WrongPassword extends Error implements ErrorInterface {
  public code = WRONG_PASSWORD.code;

  public statusCode = WRONG_PASSWORD.statusCode;

  public message = WRONG_PASSWORD.message;

  public status = getStatus(WRONG_PASSWORD.statusCode);
}
