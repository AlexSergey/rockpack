import type { IError } from './_types';

import { COMMENT_NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class CommentNotFoundErrorError extends BaseError implements IError {
  public code = COMMENT_NOT_FOUND.code;

  public message = COMMENT_NOT_FOUND.message;

  public status = getStatus(COMMENT_NOT_FOUND.statusCode);

  public statusCode = COMMENT_NOT_FOUND.statusCode;

  constructor() {
    super();
    this.name = 'CommentNotFoundErrorError';
  }
}
