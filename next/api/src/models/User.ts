import { Model, DataTypes } from 'sequelize';
import { cryptPassword, isValidPassword } from '../utils/auth';
import { sequelize } from '../boundaries/database';
import { PostModel } from './Post';
import { CommentModel } from './Comment';
import { StatisticModel } from './Statistic';
import { StatisticTypeModel } from './StatisticType';
import { InternalError, PostNotFound } from '../errors';

const PROTECTED_ATTRIBUTES = ['password', 'token'];

export interface UserInterface {
  id: number;
  username: string;
  password: string;
}

export class UserModel extends Model<UserInterface> {
  async isValidPassword(password: string): Promise<boolean> {
    return await isValidPassword(this.get('password'), password);
  }

  toJSON(): { [key: string]: unknown } {
    const attributes = Object.assign({}, this.get());

    PROTECTED_ATTRIBUTES.forEach(key => {
      delete attributes[key];
    });

    return attributes;
  }
}

UserModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  email: {
    type: new DataTypes.STRING(128),
    allowNull: false,
    validate: {
      isEmail: true,
      min: 5
    },
    unique: true
  },

  password: {
    type: new DataTypes.STRING(128),
    allowNull: false,
    validate: {
      min: 5
    },
  },

  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    }
  }
}, {
  tableName: 'users',
  sequelize,

  hooks: {
    beforeCreate: async (user): Promise<void> => {
      const { cryptedPassword } = await cryptPassword(user.get('password'));

      user.setAttributes({
        password: cryptedPassword
      });
    },

    afterCreate: async (user): Promise<void> => {
      const typeEntity = await StatisticTypeModel.findOne({
        where: {
          type: 'user'
        }
      });

      try {
        await StatisticModel.create({
          type_id: typeEntity.get('id'),
          entity_id: user.get('id'),
          posts: 0,
          comment: 0
        });
      } catch (e) {
        throw new InternalError();
      }
    },

    afterDestroy: async (user): Promise<void> => {
      const userType = await StatisticTypeModel.findOne({
        where: {
          type: 'user'
        }
      });

      try {
        await StatisticModel.destroy({
          where: {
            type_id: userType.get('id'),
            entity_id: user.get('id'),
          },
          individualHooks: true
        });

        await PostModel.destroy({
          where: {
            user_id: user.get('id')
          },
          individualHooks: true
        });

        await CommentModel.destroy({
          where: {
            user_id: user.get('id')
          },
          individualHooks: true
        });
      } catch (e) {
        throw new PostNotFound();
      }
    }
  }
});
