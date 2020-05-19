import { MulterError as MulterBaseError } from 'multer';
import { BaseError } from './_BaseError';
import { ErrorInterface } from './_types';
import { FILE_FORMAT_ERROR } from '../constants/messages';
import { Statuses } from '../utils/getStatus';

export class MulterError extends BaseError implements ErrorInterface {
  public code = FILE_FORMAT_ERROR.code;

  public statusCode = FILE_FORMAT_ERROR.statusCode;

  public status = Statuses.error;

  constructor(e: MulterBaseError | ErrorInterface) {
    super();

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
