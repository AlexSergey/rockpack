import { BaseError } from './_BaseError';
import { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { NOT_FOUND } from '../constants/messages';

export class NotFound extends BaseError implements ErrorInterface {
  public code = NOT_FOUND.code;

  public statusCode = NOT_FOUND.statusCode;

  public message = NOT_FOUND.message;

  public status = getStatus(NOT_FOUND.statusCode);
}
