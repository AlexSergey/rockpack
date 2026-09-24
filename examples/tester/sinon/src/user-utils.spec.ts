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

const aPage = (data: User[], page: number, totalPages: number): Awaited<ReturnType<typeof userApi.getPageOfUsers>> => ({
  data,
  page,
  total_pages: totalPages, // eslint-disable-line camelcase
});

describe('getAllUsers', () => {
  let getPageOfUsersStub: SinonStub;

  beforeEach(() => {
    getPageOfUsersStub = stub(userApi, 'getPageOfUsers');
  });

  afterEach(() => {
    getPageOfUsersStub.restore();
  });

  describe('negative cases', () => {
    it('returns no users when the api has none', async () => {
      getPageOfUsersStub.returns(Promise.resolve(aPage([], 1, 1)));

      await expect(users.getAllUsers()).resolves.toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('returns the users of a single page', async () => {
      getPageOfUsersStub.returns(Promise.resolve(aPage([aUser(1), aUser(2), aUser(3)], 1, 1)));

      const userList = await users.getAllUsers();

      expect(userList).toHaveLength(3);
      expect(userList[1]?.email).toBe('someemail@user2.com');
    });

    it('collects the users of every page', async () => {
      getPageOfUsersStub.onFirstCall().returns(Promise.resolve(aPage([aUser(1)], 1, 2)));
      getPageOfUsersStub.onSecondCall().returns(Promise.resolve(aPage([aUser(2)], 2, 2)));

      expect((await users.getAllUsers()).map(({ id }) => id)).toEqual([1, 2]);
    });
  });
});
