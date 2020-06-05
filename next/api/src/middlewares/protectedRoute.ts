import { UserRepository } from '../repositories/User';
import { decodeToken } from '../utils/auth';
import { Unauthorized, ExpiredToken, UserNotFound, ErrorProxy } from '../errors';

export const protectedRoute = async (ctx, next): Promise<void> => {
  const token = ctx.get('Authorization');

  if (!token) {
    throw new Unauthorized();
  }

  let currentUser;

  try {
    currentUser = decodeToken(token, process.env.JWT_SECRET);
  } catch (e) {
    ctx.cookies.set('token', '', { httpOnly: false });
    throw new ExpiredToken();
  }

  let user;

  try {
    user = await UserRepository.getUserByEmail(currentUser.email);
  } catch (e) {
    throw new ErrorProxy(e);
  }

  if (!user) {
    throw new UserNotFound();
  }

  ctx.user = user;

  await next();
};
