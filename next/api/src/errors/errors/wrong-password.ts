import type { ErrorInterface } from './_types';

import { WRONG_PASSWORD } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class WrongPasswordError extends BaseError implements ErrorInterface {
  public code = WRONG_PASSWORD.code;

  public message = WRONG_PASSWORD.message;

  public status = getStatus(WRONG_PASSWORD.statusCode);

  public statusCode = WRONG_PASSWORD.statusCode;

  constructor() {
    super();
    this.name = 'WrongPasswordError';
  }
}
