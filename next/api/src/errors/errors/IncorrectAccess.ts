import { BaseError } from './_BaseError';
import type { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { INCORRECT_ACCESS } from '../constants/messages';

export class IncorrectAccess extends BaseError implements ErrorInterface {
  public code = INCORRECT_ACCESS.code;

  public statusCode = INCORRECT_ACCESS.statusCode;

  public message = INCORRECT_ACCESS.message;

  public status = getStatus(INCORRECT_ACCESS.statusCode);
}
