import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../boundaries/database';
import { InternalError, PostNotFoundError } from '../errors';
import { cryptPassword, isValidPassword } from '../utils/auth';
import { CommentModel } from './comment';
import { PostModel } from './post';
import { StatisticModel } from './statistic';
import { StatisticTypeModel } from './statistic-type';

const PROTECTED_ATTRIBUTES = ['password', 'token'];

export interface IUser {
  id: number;
  password: string;
  role: string;
  username: string;
}

export class UserModel extends Model<IUser> {
  async isValidPassword(password: string): Promise<boolean> {
    return await isValidPassword(this.get('password') as string, password);
  }

  toJSON(): { [key: string]: unknown } {
    const attributes = { ...this.get() };

    PROTECTED_ATTRIBUTES.forEach((key) => {
      delete attributes[key];
    });

    return attributes;
  }
}

UserModel.init(
  {
    email: {
      allowNull: false,
      type: new DataTypes.STRING(128),
      unique: true,
      validate: {
        isEmail: true,
        min: 5,
      },
    },

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },

    password: {
      allowNull: false,
      type: new DataTypes.STRING(128),
      validate: {
        min: 5,
      },
    },

    role_id: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'roles',
      },
      type: DataTypes.INTEGER,
    },
  },
  {
    hooks: {
      afterCreate: async (user): Promise<void> => {
        const typeEntity = await StatisticTypeModel.findOne({
          where: {
            type: 'user',
          },
        });

        try {
          await StatisticModel.create({
            comment: 0,
            entity_id: user.get('id'),
            posts: 0,
            type_id: typeEntity.get('id'),
          });
        } catch (e) {
          throw new InternalError();
        }
      },

      afterDestroy: async (user): Promise<void> => {
        const userType = await StatisticTypeModel.findOne({
          where: {
            type: 'user',
          },
        });

        try {
          await StatisticModel.destroy({
            individualHooks: true,
            where: {
              entity_id: user.get('id'),
              type_id: userType.get('id'),
            },
          });

          await PostModel.destroy({
            individualHooks: true,
            where: {
              user_id: user.get('id'),
            },
          });

          await CommentModel.destroy({
            individualHooks: true,
            where: {
              user_id: user.get('id'),
            },
          });
        } catch (e) {
          throw new PostNotFoundError();
        }
      },

      beforeCreate: async (user): Promise<void> => {
        const { cryptedPassword } = await cryptPassword(user.get('password') as string);

        user.setAttributes({
          password: cryptedPassword,
        });
      },
    },
    sequelize,

    tableName: 'users',
  },
);
