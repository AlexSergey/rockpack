import fs from 'fs';
import util from 'util';
import path from 'path';
import sharp from 'sharp';
import config from '../config';
import logger from '../logger';

const writeFile = util.promisify(fs.writeFile);

const resizeFile = (filePath: string, resize: number | {
  width?: number;
  height?: number;
}): Promise<Buffer> => (
  new Promise((resolve, reject) => {
    sharp(filePath)
      .resize(resize)
      .toBuffer()
      .then(data => resolve(data))
      .catch(err => reject(err));
  })
);

interface ResizeImage {
  name: string;
  resize?: number | {
    width?: number;
    height?: number;
  };
}

export const resizeImage = (...fields: (string | ResizeImage)[]) => (
  async (ctx, next): Promise<void> => {
    const files = ctx.files;

    if (files) {
      for (let i = 0, l = fields.length; i < l; i++) {
        const _field = fields[i];
        const field = typeof _field === 'object' ? _field.name : _field;
        const resize = typeof _field === 'object' ? _field.resize : 200;
        const filesByField = ctx.files[field];

        if (filesByField && Array.isArray(filesByField)) {
          if (!ctx.thumbnails) {
            ctx.thumbnails = {};
          }
          ctx.thumbnails[field] = [];
          for (let j = 0, l2 = filesByField.length; j < l2; j++) {
            const file = filesByField[j];
            const filePath = path.resolve(process.env.ROOT_DIRNAME, file.path);
            try {
              const buffer = await resizeFile(filePath, resize);

              const thumbPrefix = config.files.thumbnailPrefix ? config.files.thumbnailPrefix : 'thumb';
              const thumbName = `${thumbPrefix}-${file.filename}`;
              const thumbPath = path.resolve(process.env.ROOT_DIRNAME, config.storage, thumbName);
              await writeFile(thumbPath, buffer);

              ctx.thumbnails[field].push({
                ...file,
                ...{
                  filename: thumbName,
                  path: path.join(file.destination, thumbName),
                  size: buffer.byteLength
                }
              });
            } catch (e) {
              logger.error(e.message);
            }
          }
        }
      }
    }

    await next();
  }
);
