const dotenvSafe = require('dotenv-safe');
const path = require('path');

dotenvSafe.config({
  allowEmptyValues: true,
  example: path.resolve(__dirname, '../.env.example'),
});

const tableName = 'users';
const staticTableName = 'statistic';
const ADMIN_ID = 1;
const USER_TYPE_ID = 2;

module.exports = {
  down: (queryInterface) => queryInterface.bulkDelete(tableName, null, {}),

  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      tableName,
      [
        {
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role_id: 2,
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      staticTableName,
      [
        {
          comments: 0,
          entity_id: ADMIN_ID,
          posts: 0,
          type_id: USER_TYPE_ID,
        },
      ],
      {},
    );
  },
};
