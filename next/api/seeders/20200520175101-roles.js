const tableName = 'roles';

module.exports = {
  down: (queryInterface) => queryInterface.bulkDelete(tableName, null, {}),

  up: (queryInterface) =>
    queryInterface.bulkInsert(
      tableName,
      [
        {
          role: 'user',
        },
        {
          role: 'admin',
        },
      ],
      {},
    ),
};
