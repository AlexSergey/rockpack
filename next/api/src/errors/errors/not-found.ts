import { NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class NotFoundError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'NotFoundError';
  }

  public code = NOT_FOUND.code;

  public statusCode = NOT_FOUND.statusCode;

  public message = NOT_FOUND.message;

  public status = getStatus(NOT_FOUND.statusCode);
}
