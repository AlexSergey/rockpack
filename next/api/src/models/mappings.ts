import { RoleModel } from './Role';
import { UserModel } from './User';
import { StatisticModel } from './Statistic';
import { PostModel } from './Post';
import { ImageModel } from './Image';
import { CommentModel } from './Comment';
import {
  USER_MODEL_NAME,
  ROLE_MODEL_NAME,
  STATISTIC_MODEL_NAME,
  PREVIEW_MODEL_NAME,
  PHOTOS_MODEL_NAME
} from '../constants/models';

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
