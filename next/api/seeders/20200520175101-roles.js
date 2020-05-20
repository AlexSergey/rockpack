const tableName = 'roles';

module.exports = {
  up: (queryInterface) => (
    queryInterface.bulkInsert(tableName, [
      {
        role: 'user'
      }, {
        role: 'admin'
      }
    ], {})
  ),

  down: (queryInterface) => (
    queryInterface.bulkDelete(tableName, null, {})
  )
};
