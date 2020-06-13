const tableName = 'comments';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      post_id: {
        foreignKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      text: {
        allowNull: false,
        type: Sequelize.TEXT
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable(tableName)
};
