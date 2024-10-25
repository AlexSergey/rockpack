import type { ErrorInterface } from './_types';

import { INCORRECT_ACCESS } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class IncorrectAccessError extends BaseError implements ErrorInterface {
  public code = INCORRECT_ACCESS.code;

  public message = INCORRECT_ACCESS.message;

  public status = getStatus(INCORRECT_ACCESS.statusCode);

  public statusCode = INCORRECT_ACCESS.statusCode;

  constructor() {
    super();
    this.name = 'IncorrectAccessError';
  }
}
