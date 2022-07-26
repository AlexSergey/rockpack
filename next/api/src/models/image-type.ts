import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../boundaries/database';

export interface IImageType {
  id: number;
  type_id: number;
  entity_id: number;
  posts: number;
  comments: number;
}

export class ImageTypeModel extends Model<IImageType> {}

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
