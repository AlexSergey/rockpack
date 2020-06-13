import { STATUS_CODES } from './status_codes';

export const BAD_REQUEST = {
  statusCode: STATUS_CODES.BAD_REQUEST,
  code: 'BAD_REQUEST',
  message: 'Bad Request. Your browser sent a request that this server could not understand.'
};

export const INCORRECT_ACCESS = {
  statusCode: STATUS_CODES.NOT_ACCEPTABLE,
  code: 'BAD_REQUEST',
  message: 'Incorrect access.'
};

export const DATABASE_ERROR = {
  statusCode: STATUS_CODES.BAD_REQUEST,
  code: 'DATABASE_ERROR',
  message: 'Bad Request. Your browser sent a request that this server could not understand.'
};

export const FILE_FORMAT_ERROR = {
  statusCode: STATUS_CODES.BAD_REQUEST,
  code: 'FILE_FORMAT_ERROR',
  message: 'Only .png, .jpg and .jpeg format allowed'
};

export const AUTH_REQUIRED = {
  statusCode: STATUS_CODES.UNAUTHORIZED,
  code: 'AUTH_REQUIRED',
  message: 'Authentication is needed to access the requested endpoint.'
};

export const NOT_FOUND = {
  statusCode: STATUS_CODES.NOT_FOUND,
  code: 'UNKNOWN_ENDPOINT',
  message: 'The requested endpoint does not exist.'
};

export const UNAUTHORIZED = {
  statusCode: STATUS_CODES.UNAUTHORIZED,
  code: 'UNAUTHORIZED',
  message: 'You are not authorized in the system.'
};

export const TOKEN_EXPIRED = {
  statusCode: STATUS_CODES.UNAUTHORIZED,
  code: 'TOKEN_EXPIRED',
  message: 'Session expired, please re-login'
};

export const USER_NOT_FOUND = {
  statusCode: STATUS_CODES.UNAUTHORIZED,
  code: 'USER_NOT_FOUND',
  message: 'User is not found, please re-login'
};

export const WRONG_PASSWORD = {
  statusCode: STATUS_CODES.UNAUTHORIZED,
  code: 'PASSWORD_IS_NOT_VALID',
  message: 'Wrong password'
};

export const POST_NOT_FOUND = {
  statusCode: STATUS_CODES.BAD_REQUEST,
  code: 'BAD_REQUEST',
  message: 'Post not found'
};

export const COMMENT_NOT_FOUND = {
  statusCode: STATUS_CODES.BAD_REQUEST,
  code: 'BAD_REQUEST',
  message: 'Comment not found'
};

export const UNKNOWN_RESOURCE = {
  statusCode: STATUS_CODES.NOT_FOUND,
  code: 'UNKNOWN_RESOURCE',
  message: 'The specified resource was not found.'
};

export const INVALID_REQUEST_BODY_FORMAT = {
  statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
  code: 'INVALID_REQUEST_BODY_FORMAT',
  message: 'The request body has invalid format.'
};

export const INVALID_REQUEST = {
  statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
  code: 'INVALID_REQUEST',
  message: 'The request has invalid parameters.'
};

export const INTERNAL_ERROR = {
  statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
  code: 'INTERNAL_ERROR',
  message: 'The server encountered an internal error.'
};

export const UNKNOWN_ERROR = {
  statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
  code: 'UNKNOWN_ERROR',
  message: 'The server encountered an unknown error.'
};

export const USER_ALREADY_EXISTS = {
  statusCode: STATUS_CODES.FORBIDDEN,
  code: 'USER_ALREADY_EXISTS',
  message: 'User already exists.'
};
