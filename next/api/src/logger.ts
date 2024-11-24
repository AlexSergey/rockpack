import pino from 'pino';

const logger = pino({
  transport: {
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd'|'HH:MM:ss",
    },
    target: 'pino-pretty',
  },
});

export { logger };
