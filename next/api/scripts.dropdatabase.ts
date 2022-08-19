import './src/config';
import * as database from './src/boundaries/database';
import { installMappings } from './src/mappings';
import { UserModel } from './src/models/user';
import { StatisticTypeModel } from './src/models/statistic-type';
import { ImageTypeModel } from './src/models/image-type';
import { RoleModel } from './src/models/role';
import { StatisticModel } from './src/models/statistic';

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
