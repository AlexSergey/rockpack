import { renderHook } from '@testing-library/react-hooks';

import { createAppWrapper } from '../../tests/create-app-wrapper';

import { usePosts } from './hooks';

test('Render Posts from usePosts()', async () => {
  const { result, waitForNextUpdate } = renderHook(() => usePosts(), {
    wrapper: createAppWrapper(),
  });

  try {
    await waitForNextUpdate();
  } catch (err) {
    expect(err.timeout).toBeTruthy();
  }

  const [, , posts] = result.current;

  expect(posts[0].id).toEqual(13);
  expect(posts[0].title).toEqual('The Shawshank Redemption');
});
