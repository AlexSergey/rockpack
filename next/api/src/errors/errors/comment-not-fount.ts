import { COMMENT_NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class CommentNotFoundErrorError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'CommentNotFoundErrorError';
  }

  public code = COMMENT_NOT_FOUND.code;

  public statusCode = COMMENT_NOT_FOUND.statusCode;

  public message = COMMENT_NOT_FOUND.message;

  public status = getStatus(COMMENT_NOT_FOUND.statusCode);
}
