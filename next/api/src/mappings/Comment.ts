import { RoleModel } from '../models/Role';
import { UserModel } from '../models/User';
import { CommentModel } from '../models/Comment';
import { StatisticModel } from '../models/Statistic';

export const commentMapping = (): void => {
  CommentModel.belongsTo(UserModel, { foreignKey: 'user_id' });
  UserModel.hasOne(StatisticModel, { foreignKey: 'id' });
  UserModel.belongsTo(RoleModel, { foreignKey: 'role_id' });
};
