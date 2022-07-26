import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../boundaries/database';

export interface IImage {
  id: number;
  post_id: number;
  type_id: number;
  uri: string;
}

export class ImageModel extends Model<IImage> {}

ImageModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },

    post_id: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'posts',
      },
      type: DataTypes.INTEGER,
    },

    type_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },

    uri: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: 'images',
  },
);
