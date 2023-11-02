import { Next } from 'koa';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import sharp from 'sharp';

import { config } from '../config';
import { logger } from '../logger';
import { IKoaContext } from '../types/koa.context';

const writeFile = util.promisify(fs.writeFile);

const resizeFile = (
  filePath: string,
  resize:
    | {
        height?: number;
        width?: number;
      }
    | number,
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    sharp(filePath)
      .resize(resize)
      .toBuffer()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });

interface IResizeImage {
  name: string;
  resize?:
    | {
        height?: number;
        width?: number;
      }
    | number;
}

export const resizeImage =
  (...fields: (IResizeImage | string)[]) =>
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async (ctx: IKoaContext, next: Next): Promise<void> => {
    const { files } = ctx;

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
            const filePath = path.resolve(path.resolve('./'), file.path);
            try {
              const buffer = await resizeFile(filePath, resize);

              const thumbPrefix = config.files.thumbnailPrefix ? config.files.thumbnailPrefix : 'thumb';
              const thumbName = `${thumbPrefix}-${file.filename}`;
              const thumbPath = path.resolve(path.resolve('./'), config.storage, thumbName);
              await writeFile(thumbPath, buffer);

              ctx.thumbnails[field].push({
                ...file,
                ...{
                  filename: thumbName,
                  path: path.join(file.destination, thumbName),
                  size: buffer.byteLength,
                },
              });
            } catch (e) {
              logger.error(e.message);
            }
          }
        }
      }
    }

    await next();
  };
