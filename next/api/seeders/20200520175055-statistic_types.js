const tableName = 'statistic_type';

module.exports = {
  down: (queryInterface) => queryInterface.bulkDelete(tableName, null, {}),

  up: (queryInterface) =>
    queryInterface.bulkInsert(
      tableName,
      [
        {
          type: 'post',
        },
        {
          type: 'user',
        },
      ],
      {},
    ),
};
