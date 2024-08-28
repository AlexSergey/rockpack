const tableName = 'images';

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

      post_id: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
      },

      type_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      uri: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.STRING,
      },
    }),
};
