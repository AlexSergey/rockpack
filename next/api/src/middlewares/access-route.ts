import { Next } from 'koa';

import { Roles } from '../config';
import { IncorrectAccessError } from '../errors';
import { logger } from '../logger';
import { IKoaContext } from '../types/koa.context';

export const accessRoute =
  (accessLayer: Roles | Roles[]) =>
  async (ctx: IKoaContext, next: Next): Promise<void> => {
    if (!ctx.user) {
      logger.warn('Must be used with protectedRoute middleware');
      throw new IncorrectAccessError();
    }

    const { role } = ctx.user.get('Role') as { role: Roles };

    if (Array.isArray(accessLayer) && !accessLayer.includes(role)) {
      throw new IncorrectAccessError();
    }

    if (!Array.isArray(accessLayer) && role !== accessLayer) {
      throw new IncorrectAccessError();
    }

    await next();
  };
