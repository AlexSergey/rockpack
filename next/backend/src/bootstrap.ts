import Signals = NodeJS.Signals;

import config from './config';
import logger from './logger';

process.on('unhandledRejection', reason => {
  logger.fatal({ error: reason }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', error => {
  logger.fatal(error, 'Unhandled Exception');
  process.exit(1);
});

process.on('warning', error => {
  logger.error(error, 'Warning detected');
});

process.on('exit', code => {
  logger.info(`Stopped with code: ${code}`);
});

async function bootstrap(start: () => Promise<void>, stop: () => Promise<void>) {
  let stopping = false;
  const shutdown = async () => {
    if (stopping) return;
    stopping = true;
    logger.info('Stopping...');
    const shutdownTimeout = setTimeout(() => {
      logger.error('Stopped forcefully, but we have something in Event Loop');
      process.exit(1);
    }, config.shutdownTimeout);
    try {
      await stop();
    } catch (error) {
      logger.error(error, 'Error during shutdown');
      process.exit(1);
    }
    clearTimeout(shutdownTimeout);
  };
  
  logger.info('Starting...');
  const signals: Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];
  signals.forEach(sigEvent => process.on(sigEvent, shutdown));
  
  try {
    await start();
  } catch (error) {
    logger.error(error, 'Error during bootstrap');
    process.exit(1);
  }
  
  logger.info('Started');
}

export { bootstrap }
