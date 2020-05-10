const debug = require('debug')('koa:error-handler');

const errorsHandler = () => {
  debug('Create a middleware');
  
  return async function handle(ctx, next) {
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
