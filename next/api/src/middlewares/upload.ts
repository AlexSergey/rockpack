import multer from '@koa/multer';
import { Next } from 'koa';
import path from 'node:path';

import { config } from '../config';
import { BadFileFormatError, MulterError } from '../errors';
import { KoaContext } from '../types/koa.context';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./${config.storage}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb): void => {
  if (config.files.types.find((f) => f === file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);

    return cb(new BadFileFormatError());
  }
};

const uploader = multer({
  fileFilter,
  limits: {
    fileSize: config.files.maxSize,
  },
  storage,
});

interface Upload {
  maxCount?: number;
  name: string;
}

export const upload =
  (...fields: (string | Upload)[]) =>
  async (ctx: KoaContext, next: Next): Promise<void> => {
    try {
      await uploader.fields(fields)(ctx);
    } catch (e) {
      throw new MulterError(e);
    }
    await next();
  };
