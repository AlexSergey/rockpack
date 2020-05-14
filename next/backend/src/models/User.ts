import { Model, DataTypes, Sequelize } from 'sequelize';
import { cryptPassword, isValidPassword } from '../utils/auth';

export interface UserInterface {
  id: string;
  username: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const userFactory = (sequelize: Sequelize) => {
  class User extends Model<UserInterface> {
    isValidPassword = async (userPassword, password): Promise<boolean> => await isValidPassword(userPassword, password);
  }

  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false
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
      }
    }
  });

  return User;
};
