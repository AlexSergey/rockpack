import { renderHook, waitFor } from '@testing-library/react';

import { createAppWrapper } from '../../tests/create-app-wrapper';
import { sleep } from '../../tests/helpers';
import { usePosts } from './hooks';

test('Render Posts from usePosts()', async () => {
  const { result } = renderHook(() => usePosts(), {
    wrapper: createAppWrapper(),
  });

  try {
    await waitFor(() => sleep(100));
  } catch (err) {
    expect(err.timeout).toBeTruthy();
  }

  const [, , posts] = result.current;

  expect(posts[0].id).toEqual(13);
  expect(posts[0].title).toEqual('The Shawshank Redemption');
});
