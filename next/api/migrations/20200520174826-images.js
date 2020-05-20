const tableName = 'images';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      post_id: {
        foreignKey: true,
        allowNull: false,
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
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable(tableName)
};
