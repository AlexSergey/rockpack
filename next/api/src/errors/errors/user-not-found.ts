import type { IError } from './_types';

import { USER_NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class UserNotFoundError extends BaseError implements IError {
  public code = USER_NOT_FOUND.code;

  public message = USER_NOT_FOUND.message;

  public status = getStatus(USER_NOT_FOUND.statusCode);

  public statusCode = USER_NOT_FOUND.statusCode;

  constructor() {
    super();
    this.name = 'UserNotFoundError';
  }
}
