import { act, render, renderHook } from '@testing-library/react';
import { ReactElement, useEffect } from 'react';

import { createAppWrapper } from '../../tests/create-app-wrapper';
import { sleep } from '../../tests/helpers';
import { useUser, useUserApi } from './hooks';

test('signup', async () => {
  const AppWrapper = createAppWrapper();

  const Inner = (): ReactElement => {
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
