const tableName = 'users';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      password: {
        allowNull: false,
        type: Sequelize.STRING
      },

      role_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable(tableName)
};
