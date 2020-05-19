import { Model, DataTypes } from 'sequelize';

export interface ImageInterface {
  id: number;
  post_id: number;
  type_id: number;
  uri: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const imageFactory = (sequelize) => {
  class Image extends Model<ImageInterface> {
  }

  Image.init({
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

  Image.sync();

  return Image;
};
