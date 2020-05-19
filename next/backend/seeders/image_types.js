const tableName = 'image_type';

module.exports = {
  up: (queryInterface) => (
    queryInterface.bulkInsert(tableName, [
      {
        type: 'preview'
      }, {
        type: 'photos'
      }
    ], {})
  ),

  down: (queryInterface) => (
    queryInterface.bulkDelete(tableName, null, {})
  )
};
