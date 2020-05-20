const tableName = 'roles';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      role: {
        allowNull: false,
        type: Sequelize.ENUM('user', 'admin'),
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable(tableName)
};
