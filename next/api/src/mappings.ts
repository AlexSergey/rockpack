import {
  PHOTOS_MODEL_NAME,
  PREVIEW_MODEL_NAME,
  ROLE_MODEL_NAME,
  STATISTIC_MODEL_NAME,
  USER_MODEL_NAME,
} from './constants/models';
import { CommentModel } from './models/comment';
import { ImageModel } from './models/image';
import { PostModel } from './models/post';
import { RoleModel } from './models/role';
import { StatisticModel } from './models/statistic';
import { UserModel } from './models/user';

export const installMappings = (): void => {
  UserModel.belongsTo(RoleModel, {
    as: ROLE_MODEL_NAME,
    foreignKey: 'role_id',
  });
  StatisticModel.belongsTo(UserModel, {
    as: STATISTIC_MODEL_NAME,
    foreignKey: 'id',
  });
  PostModel.belongsTo(UserModel, {
    as: USER_MODEL_NAME,
    foreignKey: 'user_id',
  });
  CommentModel.belongsTo(UserModel, {
    as: USER_MODEL_NAME,
    foreignKey: 'user_id',
  });

  UserModel.hasOne(StatisticModel, {
    as: STATISTIC_MODEL_NAME,
    foreignKey: 'entity_id',
  });
  PostModel.hasOne(StatisticModel, {
    as: STATISTIC_MODEL_NAME,
    foreignKey: 'entity_id',
  });
  PostModel.hasOne(ImageModel, {
    as: PREVIEW_MODEL_NAME,
    foreignKey: 'post_id',
  });
  PostModel.hasMany(ImageModel, {
    as: PHOTOS_MODEL_NAME,
    foreignKey: 'post_id',
  });
};
