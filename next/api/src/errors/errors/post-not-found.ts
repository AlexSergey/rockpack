import { POST_NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class PostNotFoundError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'PostNotFoundError';
  }

  public code = POST_NOT_FOUND.code;

  public statusCode = POST_NOT_FOUND.statusCode;

  public message = POST_NOT_FOUND.message;

  public status = getStatus(POST_NOT_FOUND.statusCode);
}
