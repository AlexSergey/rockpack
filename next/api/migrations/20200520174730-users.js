const tableName = 'users';

module.exports = {
  down: (queryInterface) => queryInterface.dropTable(tableName),

  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName, {
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      role_id: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
    }),
};
