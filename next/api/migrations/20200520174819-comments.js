const tableName = 'comments';

module.exports = {
  down: (queryInterface) => queryInterface.dropTable(tableName),

  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName, {
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
        type: Sequelize.DATE,
      },

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

      text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },

      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    }),
};
