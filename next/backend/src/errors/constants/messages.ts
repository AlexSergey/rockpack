import STATUSES from './statuses';

export const BAD_REQUEST = {
  statusCode: STATUSES.BAD_REQUEST,
  code: 'BAD_REQUEST',
  message: 'Bad Request. Your browser sent a request that this server could not understand.'
};

export const AUTH_REQUIRED = {
  statusCode: STATUSES.UNAUTHORIZED,
  code: 'AUTH_REQUIRED',
  message: 'Authentication is needed to access the requested endpoint.'
};

export const NOT_FOUND = {
  statusCode: STATUSES.NOT_FOUND,
  code: 'UNKNOWN_ENDPOINT',
  message: 'The requested endpoint does not exist.'
};

export const UNAUTHORIZED = {
  statusCode: STATUSES.UNAUTHORIZED,
  code: 'UNAUTHORIZED',
  message: 'You are not authorized in the system.'
};

export const UNKNOWN_RESOURCE = {
  statusCode: STATUSES.NOT_FOUND,
  code: 'UNKNOWN_RESOURCE',
  message: 'The specified resource was not found.'
};

export const INVALID_REQUEST_BODY_FORMAT = {
  statusCode: STATUSES.UNPROCESSABLE_ENTITY,
  code: 'INVALID_REQUEST_BODY_FORMAT',
  message: 'The request body has invalid format.'
};

export const INVALID_REQUEST = {
  statusCode: STATUSES.UNPROCESSABLE_ENTITY,
  code: 'INVALID_REQUEST',
  message: 'The request has invalid parameters.'
};


/**
 * Server Errors
 */
export const INTERNAL_ERROR = {
  statusCode: STATUSES.INTERNAL_SERVER_ERROR,
  code: 'INTERNAL_ERROR',
  message: 'The server encountered an internal error.'
};

export const UNKNOWN_ERROR = {
  statusCode: STATUSES.INTERNAL_SERVER_ERROR,
  code: 'UNKNOWN_ERROR',
  message: 'The server encountered an unknown error.'
};
