import { RoleModel } from './models/Role';
import { UserModel } from './models/User';
import { StatisticModel } from './models/Statistic';
import { PostModel } from './models/Post';
import { ImageModel } from './models/Image';
import { CommentModel } from './models/Comment';
import {
  USER_MODEL_NAME,
  ROLE_MODEL_NAME,
  STATISTIC_MODEL_NAME,
  PREVIEW_MODEL_NAME,
  PHOTOS_MODEL_NAME
} from './constants/models';

export const installMappings = (): void => {
  UserModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    as: ROLE_MODEL_NAME
  });
  StatisticModel.belongsTo(UserModel, {
    foreignKey: 'id',
    as: STATISTIC_MODEL_NAME
  });
  PostModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: USER_MODEL_NAME
  });
  CommentModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: USER_MODEL_NAME
  });

  UserModel.hasOne(StatisticModel, {
    foreignKey: 'entity_id',
    as: STATISTIC_MODEL_NAME
  });
  PostModel.hasOne(StatisticModel, {
    foreignKey: 'entity_id',
    as: STATISTIC_MODEL_NAME
  });
  PostModel.hasOne(ImageModel, {
    foreignKey: 'post_id',
    as: PREVIEW_MODEL_NAME
  });
  PostModel.hasMany(ImageModel, {
    foreignKey: 'post_id',
    as: PHOTOS_MODEL_NAME
  });
};
