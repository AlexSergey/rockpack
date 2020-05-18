import { Model, DataTypes } from 'sequelize';
import { statisticFactory } from './Statistic';
import { statisticTypeFactory } from './StatisticType';
import { commentFactory } from './Comment';
import { InternalError } from '../errors';

export interface PostInterface {
  id: number;
  user_id: number;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const postFactory = (sequelize) => {
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
      defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {
    tableName: 'posts',
    sequelize,
    hooks: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      afterCreate: async (post) => {
        const Statistic = statisticFactory(sequelize);
        const StatisticType = statisticTypeFactory(sequelize);

        const postType = await StatisticType.findOne({
          where: {
            type: 'post'
          }
        });

        const userType = await StatisticType.findOne({
          where: {
            type: 'user'
          }
        });

        try {
          await Statistic.create({
            type_id: postType.get('id'),
            entity_id: post.get('id'),
            comments: 0
          });

          await Statistic.update({
            posts: sequelize.literal('posts + 1')
          }, {
            where: {
              type_id: userType.get('id'),
              entity_id: post.get('user_id'),
            }
          });
        } catch (e) {
          throw new InternalError();
        }
      },

      afterDestroy: async (post) => {
        const Comment = commentFactory(sequelize);
        const Statistic = statisticFactory(sequelize);
        const StatisticType = statisticTypeFactory(sequelize);

        const userType = await StatisticType.findOne({
          where: {
            type: 'user'
          }
        });

        const comments = await Comment.findAll({
          where: {
            post_id: post.get('id')
          }
        });

        const userComments = comments
          .map(c => c.toJSON())
          .reduce((dict, comment) => {
            dict[comment.user_id] = typeof dict[comment.user_id] === 'number' ?
              dict[comment.user_id] + 1 :
              1;
            return dict;
          }, {});

        try {
          await Comment.destroy({
            where: {
              post_id: post.get('id')
            }
          });

          await Statistic.update({
            posts: sequelize.literal('posts - 1')
          }, {
            where: {
              type_id: userType.get('id'),
              entity_id: post.get('user_id'),
            }
          });
        } catch (e) {
          throw new InternalError();
        }

        const userIds = Object.keys(userComments);

        for (let i = 0, l = userIds.length; i < l; i++) {
          const userId = userIds[i];
          try {
            await Statistic.update({
              posts: sequelize.literal(`posts - ${userComments[userId]}`)
            }, {
              where: {
                type_id: userType.get('id'),
                entity_id: userId,
              }
            });
          } catch (e) {
            throw new InternalError();
          }
        }
      }
    }
  });

  Post.sync();

  return Post;
};
