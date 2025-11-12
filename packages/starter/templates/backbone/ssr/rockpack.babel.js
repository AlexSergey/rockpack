module.exports = (opts, conf) => {
  conf.plugins.unshift(require.resolve('@issr/babel-plugin'));
  return conf;
};
