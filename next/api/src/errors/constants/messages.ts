import { StatusCodes } from './status-codes';

export const BAD_REQUEST = {
  code: 'BAD_REQUEST',
  message: 'Bad Request. Your browser sent a request that this server could not understand.',
  statusCode: StatusCodes.BAD_REQUEST,
};

export const INCORRECT_ACCESS = {
  code: 'BAD_REQUEST',
  message: 'Incorrect access.',
  statusCode: StatusCodes.NOT_ACCEPTABLE,
};

export const DATABASE_ERROR = {
  code: 'DATABASE_ERROR',
  message: 'Bad Request. Your browser sent a request that this server could not understand.',
  statusCode: StatusCodes.BAD_REQUEST,
};

export const FILE_FORMAT_ERROR = {
  code: 'FILE_FORMAT_ERROR',
  message: 'Only .png, .jpg and .jpeg format allowed',
  statusCode: StatusCodes.BAD_REQUEST,
};

export const AUTH_REQUIRED = {
  code: 'AUTH_REQUIRED',
  message: 'Authentication is needed to access the requested endpoint.',
  statusCode: StatusCodes.UNAUTHORIZED,
};

export const NOT_FOUND = {
  code: 'UNKNOWN_ENDPOINT',
  message: 'The requested endpoint does not exist.',
  statusCode: StatusCodes.NOT_FOUND,
};

export const UNAUTHORIZED = {
  code: 'UNAUTHORIZED',
  message: 'You are not authorized in the system.',
  statusCode: StatusCodes.UNAUTHORIZED,
};

export const TOKEN_EXPIRED = {
  code: 'TOKEN_EXPIRED',
  message: 'Session expired, please re-login',
  statusCode: StatusCodes.UNAUTHORIZED,
};

export const USER_NOT_FOUND = {
  code: 'USER_NOT_FOUND',
  message: 'User is not found, please re-login',
  statusCode: StatusCodes.UNAUTHORIZED,
};

export const WRONG_PASSWORD = {
  code: 'PASSWORD_IS_NOT_VALID',
  message: 'Wrong password',
  statusCode: StatusCodes.UNAUTHORIZED,
};

export const POST_NOT_FOUND = {
  code: 'BAD_REQUEST',
  message: 'Post not found',
  statusCode: StatusCodes.BAD_REQUEST,
};

export const COMMENT_NOT_FOUND = {
  code: 'BAD_REQUEST',
  message: 'Comment not found',
  statusCode: StatusCodes.BAD_REQUEST,
};

export const UNKNOWN_RESOURCE = {
  code: 'UNKNOWN_RESOURCE',
  message: 'The specified resource was not found.',
  statusCode: StatusCodes.NOT_FOUND,
};

export const INVALID_REQUEST_BODY_FORMAT = {
  code: 'INVALID_REQUEST_BODY_FORMAT',
  message: 'The request body has invalid format.',
  statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
};

export const INVALID_REQUEST = {
  code: 'INVALID_REQUEST',
  message: 'The request has invalid parameters.',
  statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
};

export const INTERNAL_ERROR = {
  code: 'INTERNAL_ERROR',
  message: 'The server encountered an internal error.',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
};

export const UNKNOWN_ERROR = {
  code: 'UNKNOWN_ERROR',
  message: 'The server encountered an unknown error.',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
};

export const USER_ALREADY_EXISTS = {
  code: 'USER_ALREADY_EXISTS',
  message: 'User already exists.',
  statusCode: StatusCodes.FORBIDDEN,
};
