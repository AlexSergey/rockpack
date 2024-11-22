import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { createAppWrapper } from '../../tests/create-app-wrapper';
import { useImage } from './image.hooks';

const mock = new AxiosMockAdapter(axios);

mock.onGet('https://picsum.photos/id/0/info').reply(200, {
  author: 'Alejandro Escamilla',
  download_url: 'https://picsum.photos/id/0/5616/3744',

  height: 3744,
  id: '0',
  url: 'https://unsplash.com/photos/yC-Yzbqy7PY',

  width: 5616,
});

it('Render Image from useImage()', async () => {
  const { result } = renderHook(() => useImage(), {
    wrapper: createAppWrapper(),
  });

  await waitFor(
    () => {
      expect(result.current[2] !== '').toBe(true);
    },
    { interval: 100 },
  );

  const [, , url] = result.current;

  expect(url).toEqual('https://picsum.photos/id/0/5616/3744');
});
