const makeStats = (conf) => ({
  errorDetails: !!conf.debug,
});

module.exports = makeStats;
