import { createSsr } from '@issr/core';
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { useRockpack } from './rockpack-description.hooks';

const mock = new AxiosMockAdapter(axios);

mock.onGet('https://api.github.com/repos/AlexSergey/rockpack').reply(200, {
  description: 'Lorem ipsum',
});

const SSR = createSsr(
  {},
  {
    onlyClient: true,
  },
);

it('useRockpack', async () => {
  const { result } = renderHook(() => useRockpack(), {
    wrapper: ({ children }) => {
      return <SSR>{children}</SSR>;
    },
  });

  await waitFor(
    () => {
      expect(result.current[2] !== '').toBe(true);
    },
    { interval: 100 },
  );
  const [, , description] = result.current;

  expect(description).toEqual('Lorem ipsum');
});
