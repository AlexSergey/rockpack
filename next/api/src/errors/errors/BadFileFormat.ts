import { BaseError } from './_BaseError';
import { ErrorInterface } from './_types';
import { getStatus } from '../utils/getStatus';
import { FILE_FORMAT_ERROR } from '../constants/messages';

export class BadFileFormat extends BaseError implements ErrorInterface {
  public code = FILE_FORMAT_ERROR.code;

  public statusCode = FILE_FORMAT_ERROR.statusCode;

  public message = FILE_FORMAT_ERROR.message;

  public status = getStatus(FILE_FORMAT_ERROR.statusCode);
}
