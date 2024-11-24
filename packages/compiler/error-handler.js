module.exports = () => {
  process.on('unhandledRejection', (reason) => {
    console.error(reason, 'Unhandled Rejection');
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    console.error(error, 'Unhandled Exception');
    process.exit(1);
  });

  process.on('warning', (error) => {
    console.error(error, 'Warning detected');
  });
};
