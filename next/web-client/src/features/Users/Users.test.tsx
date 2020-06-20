import { useUsers } from './hooks';
import { createTestWrapper } from '../../tests/TestWrapper';

test('useUsers()', async () => {
  let users;

  await createTestWrapper(() => {
    const data = useUsers();

    if (Array.isArray(data) && data.length > 0) {
      users = data;
    }

    return null;
  }, {});

  expect(users.length)
    .toEqual(3);
  expect(users[1].id)
    .toEqual(2);
  expect(users[1].email)
    .toEqual('second_admin@rock.com');
});
