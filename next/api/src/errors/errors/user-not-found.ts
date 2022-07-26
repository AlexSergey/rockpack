import { USER_NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class UserNotFoundError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'UserNotFoundError';
  }

  public code = USER_NOT_FOUND.code;

  public statusCode = USER_NOT_FOUND.statusCode;

  public message = USER_NOT_FOUND.message;

  public status = getStatus(USER_NOT_FOUND.statusCode);
}
