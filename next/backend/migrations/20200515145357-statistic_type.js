const tableName = 'statistic_type';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      type: {
        allowNull: false,
        type: Sequelize.STRING,
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable(tableName)
};
