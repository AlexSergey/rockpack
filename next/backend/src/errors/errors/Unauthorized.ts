import { UNAUTHORIZED } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class Unauthorized extends Error implements ErrorInterface {
  public code = UNAUTHORIZED.code;

  public statusCode = UNAUTHORIZED.statusCode;

  public message = UNAUTHORIZED.message;

  public status = getStatus(UNAUTHORIZED.statusCode);
}
