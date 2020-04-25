const getNode = () => ({
  __dirname: false,
  __filename: false,
  console: true,
  net: 'empty',
  tls: 'empty',
  dns: 'empty'
});

module.exports = getNode;
