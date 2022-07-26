const fs = require('node:fs');
const path = require('node:path');

const { getRootRequireDir } = require('@rockpack/utils');
const { isArray } = require('valid-types');

module.exports = (options) => {
  const currentProjectFolder = getRootRequireDir();
  let src = isArray(options.src) ? options.src : [options.src];

  src = src.filter((s) => fs.existsSync(path.resolve(currentProjectFolder, s)));

  const backMax = Math.max.apply(
    null,
    src.map((s) => s.split('../').length - 1),
  );

  const rootProjectFolder = path.join(currentProjectFolder, Array(backMax).fill('../').join(''));

  src = src.map((s) => path.resolve(currentProjectFolder, s));

  src = src.map((s) => s.replace(rootProjectFolder, ''));

  return { currentProjectFolder, rootProjectFolder, src };
};
