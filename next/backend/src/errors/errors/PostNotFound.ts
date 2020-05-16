import { POST_NOT_FOUND } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { ErrorInterface } from './types';

export class PostNotFound extends Error implements ErrorInterface {
  public code = POST_NOT_FOUND.code;

  public statusCode = POST_NOT_FOUND.statusCode;

  public message = POST_NOT_FOUND.message;

  public status = getStatus(POST_NOT_FOUND.statusCode);
}
