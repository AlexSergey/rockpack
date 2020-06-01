import { userFactory } from '../models/User';
import { sequelize } from '../boundaries/database';
import { decodeToken } from '../utils/auth';
import { Unauthorized, ExpiredToken, UserNotFound } from '../errors';

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

  const User = userFactory(sequelize);

  const user = await User.findOne({
    limit: 1,
    where: {
      email: currentUser.email
    }
  });

  if (!user) {
    throw new UserNotFound();
  }

  ctx.user = user;

  await next();
};
