import type { ErrorInterface } from './_types';

import { NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class NotFoundError extends BaseError implements ErrorInterface {
  public code = NOT_FOUND.code;

  public message = NOT_FOUND.message;

  public status = getStatus(NOT_FOUND.statusCode);

  public statusCode = NOT_FOUND.statusCode;

  constructor() {
    super();
    this.name = 'NotFoundError';
  }
}
