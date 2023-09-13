import { render, act, renderHook } from '@testing-library/react';
import { useEffect } from 'react';

import { createAppWrapper } from '../../tests/create-app-wrapper';
import { sleep } from '../../tests/helpers';

import { useUserApi, useUser } from './hooks';

test('signup', async () => {
  const AppWrapper = createAppWrapper();

  const Inner = (): JSX.Element => {
    const { signup } = useUserApi();
    useEffect(() => {
      signup({
        email: 'test@user.com',
        password: '1234567',
      });
    }, [signup]);

    return null;
  };

  render(
    <AppWrapper>
      <Inner />
    </AppWrapper>,
  );

  await act(sleep(100));

  const { result } = renderHook(() => useUser(), {
    wrapper: AppWrapper,
  });

  const { email } = result.current;

  expect(email).toEqual('test@user.com');
});
