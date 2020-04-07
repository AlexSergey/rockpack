const getNode = () => {
  return {
    __dirname: false,
    __filename: false,
    console: true,
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  };
};

module.exports = getNode;
