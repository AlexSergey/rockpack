const tableName = 'statistic_type';

module.exports = {
  up: (queryInterface) => (
    queryInterface.bulkInsert(tableName, [
      {
        type: 'post'
      }, {
        type: 'user'
      }
    ], {})
  ),

  down: (queryInterface) => (
    queryInterface.bulkDelete(tableName, null, {})
  )
};
