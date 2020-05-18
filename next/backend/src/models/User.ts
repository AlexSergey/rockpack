import { Model, DataTypes } from 'sequelize';
import { cryptPassword, isValidPassword } from '../utils/auth';
import { statisticFactory } from './Statistic';
import { statisticTypeFactory } from './StatisticType';
import { InternalError } from '../errors';

export interface UserInterface {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const userFactory = (sequelize) => {
  class User extends Model<UserInterface> {
    isValidPassword = async (userPassword, password): Promise<boolean> => await isValidPassword(userPassword, password);
  }

  User.init({
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {
    tableName: 'users',
    sequelize,
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    hooks: {
      beforeCreate: async (user): Promise<void> => {
        const { cryptedPassword } = await cryptPassword(user.get('password'));

        user.setAttributes({
          password: cryptedPassword
        });
      },

      afterCreate: async (user) => {
        const Statistic = statisticFactory(sequelize);
        const StatisticType = statisticTypeFactory(sequelize);

        const typeEntity = await StatisticType.findOne({
          where: {
            type: 'user'
          }
        });

        try {
          await Statistic.create({
            type_id: typeEntity.get('id'),
            entity_id: user.get('id'),
            posts: 0,
            comment: 0
          });
        } catch (e) {
          throw new InternalError();
        }
      }
    }
  });

  User.sync();

  return User;
};
