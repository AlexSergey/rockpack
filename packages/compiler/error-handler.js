module.exports = () => {
  process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error(reason, 'Unhandled Rejection');
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    // eslint-disable-next-line no-console
    console.error(error, 'Unhandled Exception');
    process.exit(1);
  });

  process.on('warning', (error) => {
    // eslint-disable-next-line no-console
    console.error(error, 'Warning detected');
  });
};
