import 'reflect-metadata';
import './src/config';
import { installMappings } from './src/mappings';
import * as database from './src/boundaries/database';

(async () => {
  await database.start();
  await installMappings();
})();
