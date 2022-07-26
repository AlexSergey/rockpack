import { INCORRECT_ACCESS } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class IncorrectAccessError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'IncorrectAccessError';
  }

  public code = INCORRECT_ACCESS.code;

  public statusCode = INCORRECT_ACCESS.statusCode;

  public message = INCORRECT_ACCESS.message;

  public status = getStatus(INCORRECT_ACCESS.statusCode);
}
