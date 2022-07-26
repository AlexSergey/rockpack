import { FILE_FORMAT_ERROR } from '../constants/messages';
import { getStatus } from '../utils/get-status';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class BadFileFormatError extends BaseError implements IError {
  constructor() {
    super();
    this.name = 'BadFileFormatError';
  }

  public code = FILE_FORMAT_ERROR.code;

  public statusCode = FILE_FORMAT_ERROR.statusCode;

  public message = FILE_FORMAT_ERROR.message;

  public status = getStatus(FILE_FORMAT_ERROR.statusCode);
}
