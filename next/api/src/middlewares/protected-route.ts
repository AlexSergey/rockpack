import { Next } from 'koa';

import { container } from '../container';
import { ErrorProxyError, ExpiredTokenError, UnauthorizedError, UserNotFoundError } from '../errors';
import { KoaContext } from '../types/koa.context';
import { decodeToken } from '../utils/auth';

export const protectedRoute = async (ctx: KoaContext, next: Next): Promise<void> => {
  const userRepository = container.getUserRepository();
  const token = ctx.get('Authorization');

  if (!token) {
    throw new UnauthorizedError();
  }

  let currentUser;

  try {
    currentUser = decodeToken(token, process.env.JWT_SECRET);
  } catch (e) {
    console.error(e);
    ctx.cookies.set('token', '', { httpOnly: false });
    throw new ExpiredTokenError();
  }

  let user;

  try {
    user = await userRepository.getUserByEmail(currentUser.email);
  } catch (e) {
    throw new ErrorProxyError(e);
  }

  if (!user) {
    throw new UserNotFoundError();
  }

  ctx.user = user;

  await next();
};
