import { BaseError } from './_BaseError';
import { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { POST_NOT_FOUND } from '../constants/messages';

export class PostNotFound extends BaseError implements ErrorInterface {
  public code = POST_NOT_FOUND.code;

  public statusCode = POST_NOT_FOUND.statusCode;

  public message = POST_NOT_FOUND.message;

  public status = getStatus(POST_NOT_FOUND.statusCode);
}
