import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../boundaries/database';

export interface IStatistic {
  comments: number;
  entity_id: number;
  id: number;
  posts: number;
  type_id: number;
}

export class StatisticModel extends Model<IStatistic> {}

StatisticModel.init(
  {
    comments: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },

    entity_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },

    posts: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },

    type_id: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'statistic_type',
      },
      type: DataTypes.INTEGER,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ['id', 'type_id', 'entity_id'] },
    },
    sequelize,
    tableName: 'statistic',
  },
);
