import { renderHook, waitFor } from '@testing-library/react';

import { createAppWrapper } from '../../tests/create-app-wrapper';
import { useImage } from './hooks';

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
