import { RoleModel } from '../models/Role';
import { UserModel } from '../models/User';
import { StatisticModel } from '../models/Statistic';
import { PostModel } from '../models/Post';
import { ImageModel } from '../models/Image';

export const postMapping = (): void => {
  PostModel.belongsTo(UserModel, { foreignKey: 'user_id' });
  UserModel.hasOne(StatisticModel, { foreignKey: 'entity_id' });
  StatisticModel.belongsTo(UserModel, { foreignKey: 'id' });
  UserModel.belongsTo(RoleModel, { foreignKey: 'role_id' });
  StatisticModel.belongsTo(UserModel, { foreignKey: 'id' });
  PostModel.hasOne(StatisticModel, { foreignKey: 'entity_id' });
  ImageModel.hasMany(PostModel, { foreignKey: 'id' });
  PostModel.hasOne(ImageModel, { foreignKey: 'post_id' });
};
