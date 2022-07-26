/* eslint import/no-import-module-exports:0 */
import 'reflect-metadata';

import { bootstrapper } from './bootstrapper';
import * as database from './boundaries/database';
import * as http from './boundaries/http';
import { logger } from './logger';
import { installMappings } from './mappings';

export const start = async (): Promise<void> => {
  try {
    await http.start();
    await database.start();
    installMappings();
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
