import { BaseError } from './_BaseError';
import type { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { WRONG_PASSWORD } from '../constants/messages';

export class WrongPassword extends BaseError implements ErrorInterface {
  public code = WRONG_PASSWORD.code;

  public statusCode = WRONG_PASSWORD.statusCode;

  public message = WRONG_PASSWORD.message;

  public status = getStatus(WRONG_PASSWORD.statusCode);
}
