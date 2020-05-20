import { BaseError } from './_BaseError';
import { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { BAD_REQUEST } from '../constants/messages';

export class BadRequest extends BaseError implements ErrorInterface {
  public code = BAD_REQUEST.code;

  public statusCode = BAD_REQUEST.statusCode;

  public message = BAD_REQUEST.message;

  public status = getStatus(BAD_REQUEST.statusCode);
}
