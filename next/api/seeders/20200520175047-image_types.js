const tableName = 'image_type';

module.exports = {
  down: (queryInterface) => queryInterface.bulkDelete(tableName, null, {}),

  up: (queryInterface) =>
    queryInterface.bulkInsert(
      tableName,
      [
        {
          type: 'preview',
        },
        {
          type: 'photos',
        },
      ],
      {},
    ),
};
