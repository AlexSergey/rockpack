import type { User } from './user-api';

import * as userApi from './user-api';

export async function getAllUsers(): Promise<User[]> {
  const users: User[] = [];
  let page = 0;
  let usersPage: Awaited<ReturnType<typeof userApi.getPageOfUsers>> | null = null;

  do {
    page += 1;
    usersPage = await userApi.getPageOfUsers(page);
    users.push(...usersPage.data);
  } while (usersPage.total_pages > page);

  return users;
}
