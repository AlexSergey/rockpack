import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../boundaries/database';

export interface ImageInterface {
  id: number;
  post_id: number;
  type_id: number;
  uri: string;
}

export class ImageModel extends Model<ImageInterface> { }

ImageModel.init({
  id: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  post_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'posts',
      key: 'id',
    }
  },

  type_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  uri: {
    allowNull: false,
    defaultValue: 0,
    type: DataTypes.INTEGER,
  }
}, {
  tableName: 'images',
  sequelize
});
