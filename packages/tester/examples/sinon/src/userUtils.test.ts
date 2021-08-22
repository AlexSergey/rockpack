import { stub } from 'sinon';
import * as userApi from './userApi';
import * as users from './userUtils';

function aUser(id) {
  return {
    id,
    email: `someemail@user${id}.com`,
    first_name: `firstName${id}`,
    last_name: `lastName${id}`,
    avatar: `https://www.somepage${id}.com`
  };
}

let getPageOfUsersStub;

beforeAll(() => {
  getPageOfUsersStub = stub(userApi, 'getPageOfUsers');

  const pageOfUsers = {
    page: 1,
    total_pages: 1,
    data: [aUser(1), aUser(2), aUser(3)]
  };

  getPageOfUsersStub.returns(Promise.resolve(pageOfUsers));
});

afterAll(() => {
  getPageOfUsersStub.restore();
});

test('test getAllUsers', async () => {
  const userList = await users.getAllUsers();

  expect(userList.length)
    .toBe(3);

  expect(userList[1].email)
    .toBe('someemail@user2.com');
});
