import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../boundaries/database';

export interface StatisticTypeInterface {
  id: number;
  type_id: number;
  entity_id: number;
  posts: number;
  comments: number;
}

export class StatisticTypeModel extends Model<StatisticTypeInterface> { }

StatisticTypeModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  type: {
    type: DataTypes.ENUM('post', 'user'),
    allowNull: false,
  }
}, {
  tableName: 'statistic_type',
  sequelize
});
