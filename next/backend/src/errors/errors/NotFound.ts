import { NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class NotFound extends Error implements ErrorInterface {
  public code = NOT_FOUND.code;

  public statusCode = NOT_FOUND.statusCode;

  public message = NOT_FOUND.message;

  public status = getStatus(NOT_FOUND.statusCode);
}
