import { Context } from 'koa';
import createDebugger from 'debug';
import { BadRequest } from '../errors/BadRequest';

const debug = createDebugger('koa:error-handler');

const errorsHandler = (): (ctx: Context, next: () => Promise<unknown>) => Promise<void> => {
  debug('Create a middleware');

  return async function handle(ctx, next): Promise<void> {
    try {
      await next();
    } catch (err) {
      if (
        err.message &&
        err.statusCode &&
        err.code &&
        err.status
      ) {
        ctx.status = err.statusCode;

        ctx.body = {
          message: err.message,
          code: err.code,
          status: err.status,
          statusCode: err.statusCode
        };
      } else {
        const badRequest = new BadRequest();

        ctx.status = badRequest.statusCode;

        ctx.body = {
          message: badRequest.message,
          code: badRequest.code,
          status: badRequest.status,
          statusCode: badRequest.statusCode
        };
      }
    }
  };
};

export { errorsHandler };
