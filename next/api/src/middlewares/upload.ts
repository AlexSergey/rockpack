import path from 'path';
import { Next } from 'koa';
import multer from '@koa/multer';
import { config } from '../config';
import { BadFileFormat, MulterError } from '../errors';
import { KoaContext } from '../types/koa.context';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./${config.storage}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb): void => {
  if (config.files.types.find(f => f === file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new BadFileFormat());
  }
};

const uploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.files.maxSize
  }
});

interface UploadInterface {
  name: string;
  maxCount?: number;
}

export const upload = (...fields: (string | UploadInterface)[]) => (
  async (ctx: KoaContext, next: Next): Promise<void> => {
    try {
      await uploader.fields(fields)(ctx);
    } catch (e) {
      throw new MulterError(e);
    }
    await next();
  }
);
