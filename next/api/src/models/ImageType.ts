import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../boundaries/database';

export interface ImageTypeInterface {
  id: number;
  type_id: number;
  entity_id: number;
  posts: number;
  comments: number;
}

export class ImageTypeModel extends Model<ImageTypeInterface> { }

ImageTypeModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  type: {
    type: DataTypes.ENUM('preview', 'photos'),
    allowNull: false,
  }
}, {
  tableName: 'image_type',
  sequelize
});
