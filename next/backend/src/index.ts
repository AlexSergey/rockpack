import 'reflect-metadata';

import { bootstrapper } from './bootstrapper';
import * as http from './boundaries/http';
import * as database from './boundaries/database';
import logger from './logger';

export const start = async (): Promise<void> => {
  try {
    await http.start();
    await database.start();
  } catch (e) {
    logger.error(e.message);
  }
};

export const stop = async (): Promise<void> => {
  try {
    await http.stop();
    await database.stop();
  } catch (e) {
    logger.error(e.message);
  }
};

if (!module.parent) {
  bootstrapper(start, stop);
}
