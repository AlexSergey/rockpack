const capitalize = s => {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0)
    .toUpperCase() + s.slice(1);
};

function getTitle(packageJson) {
  if (!packageJson) {
    return false;
  }
  if (!packageJson.name) {
    return false;
  }
  return `${packageJson.name.split('_')
    .join(' ')}`;
}

module.exports = {
  capitalize,
  getTitle
};
