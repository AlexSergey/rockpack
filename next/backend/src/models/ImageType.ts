import { Model, DataTypes, Sequelize } from 'sequelize';

export interface ImageTypeInterface {
  id: number;
  type_id: number;
  entity_id: number;
  posts: number;
  comments: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const imageTypeFactory = (sequelize: Sequelize) => {
  class ImageType extends Model<ImageTypeInterface> {
  }

  ImageType.init({
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

  ImageType.sync();

  return ImageType;
};
