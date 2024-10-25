import type { ErrorInterface } from './_types';

import { FILE_FORMAT_ERROR } from '../constants/messages';
import { getStatus } from '../utils/get-status';
import { BaseError } from './_base-error';

export class BadFileFormatError extends BaseError implements ErrorInterface {
  public code = FILE_FORMAT_ERROR.code;

  public message = FILE_FORMAT_ERROR.message;

  public status = getStatus(FILE_FORMAT_ERROR.statusCode);

  public statusCode = FILE_FORMAT_ERROR.statusCode;

  constructor() {
    super();
    this.name = 'BadFileFormatError';
  }
}
