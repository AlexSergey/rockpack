import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../boundaries/database';

export interface ImageType {
  comments: number;
  entity_id: number;
  id: number;
  posts: number;
  type_id: number;
}

export class ImageTypeModel extends Model<ImageType> {}

ImageTypeModel.init(
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },

    type: {
      allowNull: false,
      type: DataTypes.ENUM('preview', 'photos'),
    },
  },
  {
    sequelize,
    tableName: 'image_type',
  },
);
