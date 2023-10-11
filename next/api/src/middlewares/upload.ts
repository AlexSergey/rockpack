import multer from '@koa/multer';
import { Next } from 'koa';
import path from 'node:path';

import { config } from '../config';
import { BadFileFormatError, MulterError } from '../errors';
import { IKoaContext } from '../types/koa.context';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./${config.storage}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// eslint-disable-next-line consistent-return
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

interface IUpload {
  maxCount?: number;
  name: string;
}

export const upload =
  (...fields: (IUpload | string)[]) =>
  async (ctx: IKoaContext, next: Next): Promise<void> => {
    try {
      await uploader.fields(fields)(ctx);
    } catch (e) {
      throw new MulterError(e);
    }
    await next();
  };
