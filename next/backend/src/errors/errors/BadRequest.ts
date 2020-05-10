import { BAD_REQUEST } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class BadRequest extends Error implements ErrorInterface {
  public code = BAD_REQUEST.code;
  
  public statusCode = BAD_REQUEST.statusCode;
  
  public message = BAD_REQUEST.message;
  
  public status = getStatus(BAD_REQUEST.statusCode);
}
