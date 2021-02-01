import './src/config';
import * as database from './src/boundaries/database';
import { installMappings } from './src/mappings';
import { UserModel } from './src/models/User';
import { StatisticTypeModel } from './src/models/StatisticType';
import { ImageTypeModel } from './src/models/ImageType';
import { RoleModel } from './src/models/Role';
import { StatisticModel } from './src/models/Statistic';

(async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Dropdatabase script must be used only in test env!');
    process.exit(1);
    return;
  }
  try {
    await database.start();
    await installMappings();

    await UserModel.destroy({
      where: {},
      truncate: true,
      individualHooks: true
    });

    await StatisticTypeModel.destroy({
      where: {},
      truncate: true
    });

    await ImageTypeModel.destroy({
      where: {},
      truncate: true
    });

    await RoleModel.destroy({
      where: {},
      truncate: true
    });

    await StatisticModel.destroy({
      where: {},
      truncate: true
    });

    await database.stop();
  } catch (e) {
    console.log(e);
    await database.stop();
  }
})();
