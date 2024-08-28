const tableName = 'statistic';

module.exports = {
  down: (queryInterface) => queryInterface.dropTable(tableName),

  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName, {
      comments: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },

      entity_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      posts: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },

      type_id: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
      },
    }),
};
