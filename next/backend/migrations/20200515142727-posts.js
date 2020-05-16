const tableName = 'posts';

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
        foreignKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      text: {
        allowNull: false,
        type: Sequelize.STRING
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable(tableName)
};
