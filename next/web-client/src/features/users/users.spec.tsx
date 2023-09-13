import { renderHook, waitFor } from '@testing-library/react';

import { createAppWrapper } from '../../tests/create-app-wrapper';
import { sleep } from '../../tests/helpers';

import { useUsers } from './hooks';

test('useUsers()', async () => {
  const { result } = renderHook(() => useUsers(), {
    wrapper: createAppWrapper(),
  });

  try {
    await waitFor(() => sleep(100));
  } catch (err) {
    expect(err.timeout).toBeTruthy();
  }

  const users = result.current;

  expect(users.length).toEqual(3);
  expect(users[1].id).toEqual(2);
  expect(users[1].email).toEqual('second_admin@rock.com');
});
