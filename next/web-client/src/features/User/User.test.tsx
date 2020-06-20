import { useEffect } from 'react';
import { useUserApi } from './hooks';
import { createTestWrapper } from '../../tests/TestWrapper';

test('signup', async () => {
  const { store } = await createTestWrapper(() => {
    const api = useUserApi();

    useEffect(() => {
      api.signup({
        email: 'test@user.com',
        password: '1234567'
      });
      //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  }, {});

  const state = store.getState().user;

  expect(state.email)
    .toEqual('test@user.com');
});
