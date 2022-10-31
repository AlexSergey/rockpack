import { renderHook } from '@testing-library/react-hooks';

import { createAppWrapper } from '../../tests/create-app-wrapper';

import { useImage } from './hooks';

it('Render Image from useImage()', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useImage(), {
    wrapper: createAppWrapper(),
  });

  await waitForNextUpdate({ timeout: 100 });

  const [, , url] = result.current;

  expect(url).toEqual('https://picsum.photos/id/0/5616/3744');
});
