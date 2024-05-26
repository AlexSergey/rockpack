const makeStats = (conf) => {
  return conf.debug
    ? {
        errorDetails: true,
      }
    : 'errors-only';
};

module.exports = makeStats;
