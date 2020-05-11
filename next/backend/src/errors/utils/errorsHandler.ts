import { Context } from 'koa';
import createDebugger from 'debug';

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
      }
    }
  };
};

export default errorsHandler;
