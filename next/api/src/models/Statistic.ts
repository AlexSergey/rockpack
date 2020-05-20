import { Model, DataTypes, Sequelize } from 'sequelize';

export interface StatisticInterface {
  id: number;
  type_id: number;
  entity_id: number;
  posts: number;
  comments: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const statisticFactory = (sequelize: Sequelize) => {
  class Statistic extends Model<StatisticInterface> {
  }

  Statistic.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },

    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'statistic_type',
        key: 'id',
      }
    },

    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    posts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    comments: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    defaultScope: {
      attributes: { exclude: ['id', 'type_id', 'entity_id'] }
    },
    tableName: 'statistic',
    sequelize
  });

  Statistic.sync();

  return Statistic;
};
