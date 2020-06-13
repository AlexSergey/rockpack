import pino from 'pino';

const logger = pino({
  prettyPrint: {
    colorize: true,
    translateTime: 'yyyy-mm-dd\'|\'HH:MM:ss'
  }
});

export { logger };
