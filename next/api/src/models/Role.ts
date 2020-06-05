import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../boundaries/database';

export interface RoleInterface {
  id: number;
  role: number;
}

export class RoleModel extends Model<RoleInterface> { }

RoleModel.init({
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
