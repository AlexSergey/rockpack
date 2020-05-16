import { Model, DataTypes, Sequelize } from 'sequelize';

export interface PostInterface {
  id: number;
  user_id: number;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const postFactory = (sequelize: Sequelize) => {
  class Post extends Model<PostInterface> {}

  Post.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('NOW()')
    }
  }, {
    tableName: 'posts',
    sequelize
  });

  Post.sync();

  return Post;
};
