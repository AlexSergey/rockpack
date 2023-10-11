import type { IError } from './_types';

import { USER_ALREADY_EXISTS } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class UserAlreadyExistsError extends BaseError implements IError {
  public code = USER_ALREADY_EXISTS.code;

  public message = USER_ALREADY_EXISTS.message;

  public status = getStatus(USER_ALREADY_EXISTS.statusCode);

  public statusCode = USER_ALREADY_EXISTS.statusCode;

  constructor() {
    super();
    this.name = 'UserAlreadyExistsError';
  }
}
