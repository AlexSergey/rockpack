import './src/config';

// eslint-disable-next-line perfectionist/sort-imports
import * as database from './src/boundaries/database';
import { installMappings } from './src/mappings';
import { ImageTypeModel } from './src/models/image-type';
import { RoleModel } from './src/models/role';
import { StatisticModel } from './src/models/statistic';
import { StatisticTypeModel } from './src/models/statistic-type';
import { UserModel } from './src/models/user';

(async (): Promise<void> => {
  console.log(`Using environment "${process.env.NODE_ENV}"`);
  if (process.env.NODE_ENV !== 'test') {
    console.error('Dropdatabase script must be used only in test env!');
    process.exit(1);

    return;
  }
  try {
    await database.start();
    await installMappings();

    await UserModel.destroy({
      individualHooks: true,
      truncate: true,
      where: {},
    });

    await StatisticTypeModel.destroy({
      truncate: true,
      where: {},
    });

    await ImageTypeModel.destroy({
      truncate: true,
      where: {},
    });

    await RoleModel.destroy({
      truncate: true,
      where: {},
    });

    await StatisticModel.destroy({
      truncate: true,
      where: {},
    });

    await database.stop();
  } catch (e) {
    console.log(e);
    await database.stop();
  }
})();
