const makeDevtool = (mode) => {
  switch (mode) {
    case 'development':
      return 'eval-source-map';
    case 'production':
      return 'hidden-source-map';
    default:
      return 'inline-source-map';
  }
};

module.exports = makeDevtool;
