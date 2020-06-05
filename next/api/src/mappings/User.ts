import { RoleModel } from '../models/Role';
import { UserModel } from '../models/User';
import { StatisticModel } from '../models/Statistic';

export const userMapping = (): void => {
  UserModel.belongsTo(RoleModel, { foreignKey: 'role_id' });
  UserModel.hasOne(StatisticModel, { foreignKey: 'entity_id' });
  StatisticModel.belongsTo(UserModel, { foreignKey: 'id' });
};
