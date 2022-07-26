import { USER_ALREADY_EXISTS } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class UserAlreadyExistsError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'UserAlreadyExistsError';
  }

  public code = USER_ALREADY_EXISTS.code;

  public statusCode = USER_ALREADY_EXISTS.statusCode;

  public message = USER_ALREADY_EXISTS.message;

  public status = getStatus(USER_ALREADY_EXISTS.statusCode);
}
