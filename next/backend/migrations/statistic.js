const tableName = 'statistic';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      type_id: {
        foreignKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      entity_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      posts: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },

      comments: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
    })
  ),

  down: (queryInterface) => queryInterface.dropTable(tableName)
};
