let shuttingDown = false;

export const errorHandler = (): void => {
  process.on('unhandledRejection', (reason) => {
    console.error(reason, 'Unhandled Rejection');
  });

  process.on('uncaughtException', (error) => {
    console.error(error, 'Unhandled Exception');
  });

  process.on('warning', (warning) => {
    console.error(warning, 'Warning detected');
  });

  const shutdown = (): void => {
    if (shuttingDown) return;

    shuttingDown = true;

    try {
    } finally {
      process.exit(0);
    }
  };

  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());
};
