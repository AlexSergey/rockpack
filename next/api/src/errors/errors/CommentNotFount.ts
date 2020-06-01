import { BaseError } from './_BaseError';
import { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { COMMENT_NOT_FOUND } from '../constants/messages';

export class CommentNotFound extends BaseError implements ErrorInterface {
  public code = COMMENT_NOT_FOUND.code;

  public statusCode = COMMENT_NOT_FOUND.statusCode;

  public message = COMMENT_NOT_FOUND.message;

  public status = getStatus(COMMENT_NOT_FOUND.statusCode);
}
