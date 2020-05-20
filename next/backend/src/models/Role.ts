import { Model, DataTypes, Sequelize } from 'sequelize';

export interface RoleInterface {
  id: number;
  role: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const roleFactory = (sequelize: Sequelize) => {
  class Role extends Model<RoleInterface> {
  }

  Role.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },

    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
    }
  }, {
    tableName: 'roles',
    sequelize
  });

  Role.sync();

  return Role;
};
