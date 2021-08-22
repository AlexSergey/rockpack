/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks';
import { usePosts } from './hooks';
import { createAppWrapper } from '../../tests/createAppWrapper';

test('Render Posts from usePosts()', async () => {
  const { result, waitForNextUpdate } = renderHook(() => usePosts(), {
    wrapper: createAppWrapper(),
  });

  try {
    await waitForNextUpdate();
  } catch (err) {
    expect(err.timeout)
      .toBeTruthy();
  }

  const [, , posts] = result.current;

  expect(posts[0].id)
    .toEqual(13);
  expect(posts[0].title)
    .toEqual('The Shawshank Redemption');
});
