const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');

const { images, prefix, storage } = argv;

const files = images.indexOf(',') > 0 ? images.split(',') : [images];

for (let i = 0, l = files.length; i < l; i++) {
  const image = files[i];
  const fullImagePath = path.resolve(storage, image);
  const thumbnail = `${prefix}-${image}`;
  const thumbnailPath = path.resolve(storage, thumbnail);

  if (fs.existsSync(fullImagePath)) {
    fs.unlinkSync(fullImagePath);
  }

  if (fs.existsSync(thumbnailPath)) {
    fs.unlinkSync(thumbnailPath);
  }
}

process.exit(0);
