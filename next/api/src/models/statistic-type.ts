import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../boundaries/database';

export interface IStatisticType {
  comments: number;
  entity_id: number;
  id: number;
  posts: number;
  type_id: number;
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
