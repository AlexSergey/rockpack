import 'reflect-metadata';

import './src/config';

// eslint-disable-next-line perfectionist/sort-imports
import * as database from './src/boundaries/database';
import { installMappings } from './src/mappings';

(async () => {
  await database.start();
  await installMappings();
})();
