import createDebugger from 'debug';
import { Context } from 'koa';

import { BadRequestError } from '../errors/bad-request';

const debug = createDebugger('koa:error-handler');

const errorsHandler = (): ((ctx: Context, next: () => Promise<unknown>) => Promise<void>) => {
  debug('Create a middleware');

  return async function handle(ctx, next): Promise<void> {
    try {
      await next();
    } catch (err) {
      if (err.message && err.statusCode && err.code && err.status) {
        ctx.status = err.statusCode;

        ctx.body = {
          code: err.code,
          message: err.message,
          status: err.status,
          statusCode: err.statusCode,
        };
      } else {
        const badRequest = new BadRequestError();

        ctx.status = badRequest.statusCode;

        ctx.body = {
          code: badRequest.code,
          message: badRequest.message,
          status: badRequest.status,
          statusCode: badRequest.statusCode,
        };
      }
    }
  };
};

export { errorsHandler };
