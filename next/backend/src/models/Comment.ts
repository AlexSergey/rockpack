import { Model, DataTypes, Sequelize } from 'sequelize';

export interface PostInterface {
  id: number;
  user_id: number;
  post_id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const commentFactory = (sequelize: Sequelize) => {
  class Comment extends Model<PostInterface> {
  }

  Comment.init({
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
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id',
      }
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
    tableName: 'comments',
    sequelize
  });

  Comment.sync();

  return Comment;
};
