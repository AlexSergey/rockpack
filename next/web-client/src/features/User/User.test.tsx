/**
 * @jest-environment jsdom
 */
import React, { createElement, useEffect } from 'react';
import { render, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useUserApi, useUser } from './hooks';
import { createAppWrapper } from '../../tests/createAppWrapper';
import { sleep } from '../../tests/helpers';

test('signup', async () => {
  const AppWrapper = createAppWrapper();

  const Inner = (): JSX.Element => {
    const { signup } = useUserApi();
    useEffect(() => {
      signup({
        email: 'test@user.com',
        password: '1234567'
      });
    }, [signup]);
    return null;
  };

  render(createElement(() => (
    <AppWrapper>
      <Inner />
    </AppWrapper>
  )));

  await act(sleep(100));

  const { result } = renderHook(() => useUser(), {
    wrapper: AppWrapper,
  });

  const { email } = result.current;

  expect(email)
    .toEqual('test@user.com');
});
