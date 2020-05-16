import { Model, DataTypes, Sequelize } from 'sequelize';

export interface StatisticTypeInterface {
  id: number;
  type_id: number;
  entity_id: number;
  posts: number;
  comments: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const statisticTypeFactory = (sequelize: Sequelize) => {
  class StatisticType extends Model<StatisticTypeInterface> {
  }

  StatisticType.init({
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

  StatisticType.sync();

  return StatisticType;
};
