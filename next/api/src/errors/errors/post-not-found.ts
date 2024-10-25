import type { ErrorInterface } from './_types';

import { POST_NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class PostNotFoundError extends BaseError implements ErrorInterface {
  public code = POST_NOT_FOUND.code;

  public message = POST_NOT_FOUND.message;

  public status = getStatus(POST_NOT_FOUND.statusCode);

  public statusCode = POST_NOT_FOUND.statusCode;

  constructor() {
    super();
    this.name = 'PostNotFoundError';
  }
}
