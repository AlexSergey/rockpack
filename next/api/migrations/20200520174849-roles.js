const tableName = 'roles';

module.exports = {
  down: (queryInterface) => queryInterface.dropTable(tableName),

  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      role: {
        allowNull: false,
        type: Sequelize.ENUM('user', 'admin'),
      },
    }),
};
