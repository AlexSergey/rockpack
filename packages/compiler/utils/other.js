const capitalize = (s) => {
  if (typeof s !== 'string') {
    return '';
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
};

function getTitle(packageJson) {
  if (!packageJson) {
    return false;
  }
  if (!packageJson.name) {
    return false;
  }

  return `${packageJson.name.split('_').join(' ')}`;
}

function getMajorVersion(version) {
  return typeof version === 'string' && version.includes('.') ? version.split('.')[0] : false;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  capitalize,
  getMajorVersion,
  getRandomInt,
  getTitle,
};
