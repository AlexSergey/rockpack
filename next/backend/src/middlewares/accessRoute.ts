import { roleFactory } from '../models/Role';
import { sequelize } from '../boundaries/database';
import { IncorrectAccess } from '../errors';
import logger from '../logger';
import { Roles } from '../config';

export const accessRoute = (accessLayer: Roles | Roles[]) => (
  async (ctx, next): Promise<void> => {
    if (!ctx.user) {
      logger.warn('Must be used with protectedRoute middleware');
      throw new IncorrectAccess();
    }

    const roleId = ctx.user.get('role_id');

    const Role = roleFactory(sequelize);

    const role = await Role.findOne({
      limit: 1,
      where: {
        id: roleId
      },
    });

    if (Array.isArray(accessLayer) && !accessLayer.includes(role.get('role'))) {
      throw new IncorrectAccess();
    }

    if (!Array.isArray(accessLayer) && role.get('role') !== accessLayer) {
      throw new IncorrectAccess();
    }

    await next();
  }
);
