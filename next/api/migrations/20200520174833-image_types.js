const tableName = 'image_type';

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

      type: {
        allowNull: false,
        type: Sequelize.ENUM('preview', 'photos'),
      },
    }),
};
