import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../boundaries/database';

export interface Role {
  id: number;
  role: number;
}

export class RoleModel extends Model<Role> {}

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
