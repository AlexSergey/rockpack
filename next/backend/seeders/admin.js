const path = require('path');
const dotenvSafe = require('dotenv-safe');

dotenvSafe.config({
  example: path.resolve(__dirname, '../.env.example'),
  allowEmptyValues: true
});

const tableName = 'users';
const staticTableName = 'statistic';
const ADMIN_ID = 1;
const USER_TYPE_ID = 2;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(tableName, [
      {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role_id: 2
      }
    ], {});

    await queryInterface.bulkInsert(staticTableName, [
      {
        type_id: USER_TYPE_ID,
        entity_id: ADMIN_ID,
        posts: 0,
        comments: 0
      }
    ], {});
  },

  down: (queryInterface) => (
    queryInterface.bulkDelete(tableName, null, {})
  )
};
