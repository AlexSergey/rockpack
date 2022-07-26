import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../boundaries/database';

export interface IRole {
  id: number;
  role: number;
}

export class RoleModel extends Model<IRole> {}

RoleModel.init(
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },

    role: {
      allowNull: false,
      type: DataTypes.ENUM('user', 'admin'),
    },
  },
  {
    sequelize,
    tableName: 'roles',
  },
);
