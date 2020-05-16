import { INTERNAL_ERROR } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class InternalError extends Error implements ErrorInterface {
  public code = INTERNAL_ERROR.code;

  public statusCode = INTERNAL_ERROR.statusCode;

  public message = INTERNAL_ERROR.message;

  public status = getStatus(INTERNAL_ERROR.statusCode);
}
