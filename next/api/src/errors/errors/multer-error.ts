import { MulterError as MulterBaseError } from 'multer';

import type { IError } from './_types';

import { FILE_FORMAT_ERROR } from '../constants/messages';
import { Statuses } from '../utils/get-status';
import { BaseError } from './_base-error';

export class MulterError extends BaseError implements IError {
  public code = FILE_FORMAT_ERROR.code;

  public status = Statuses.error;

  public statusCode = FILE_FORMAT_ERROR.statusCode;

  constructor(e: IError | MulterBaseError) {
    super();
    this.name = 'MulterError';

    if (e instanceof MulterBaseError) {
      this.message = e.message;
    } else {
      this.code = e.code;
      this.statusCode = e.statusCode;
      this.status = e.status;
      this.message = e.message;
    }
  }
}
