import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../boundaries/database';

export interface IStatisticType {
  id: number;
  type_id: number;
  entity_id: number;
  posts: number;
  comments: number;
}

export class StatisticTypeModel extends Model<IStatisticType> {}

StatisticTypeModel.init(
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },

    type: {
      allowNull: false,
      type: DataTypes.ENUM('post', 'user'),
    },
  },
  {
    sequelize,
    tableName: 'statistic_type',
  },
);
