import type { SinonStub } from 'sinon';

import { stub } from 'sinon';

import type { User } from './user-api';

import * as userApi from './user-api';
import * as users from './user-utils';

function aUser(id: number): User {
  return {
    avatar: `https://www.somepage${id}.com`,
    email: `someemail@user${id}.com`,
    first_name: `firstName${id}`, // eslint-disable-line camelcase
    id,
    last_name: `lastName${id}`, // eslint-disable-line camelcase
  };
}

let getPageOfUsersStub: SinonStub;

beforeAll(() => {
  getPageOfUsersStub = stub(userApi, 'getPageOfUsers');

  getPageOfUsersStub.returns(
    Promise.resolve({
      data: [aUser(1), aUser(2), aUser(3)],
      page: 1,
      total_pages: 1, // eslint-disable-line camelcase
    }),
  );
});

afterAll(() => {
  getPageOfUsersStub.restore();
});

test('test getAllUsers', async () => {
  const userList = await users.getAllUsers();
  expect(userList.length).toBe(3);
  expect(userList[1]?.email).toBe('someemail@user2.com');
});
