import { WRONG_PASSWORD } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class WrongPasswordError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'WrongPasswordError';
  }

  public code = WRONG_PASSWORD.code;

  public statusCode = WRONG_PASSWORD.statusCode;

  public message = WRONG_PASSWORD.message;

  public status = getStatus(WRONG_PASSWORD.statusCode);
}
