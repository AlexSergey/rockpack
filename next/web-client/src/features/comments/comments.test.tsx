import { renderHook } from '@testing-library/react-hooks';

import { createAppWrapper } from '../../tests/create-app-wrapper';

import { useComments } from './hooks';

test('Comments test useComments()', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useComments(13), {
    wrapper: createAppWrapper(),
  });

  try {
    await waitForNextUpdate();
  } catch (err) {
    expect(err.timeout).toBeTruthy();
  }

  const [, , comments] = result.current;

  expect(comments.length).toEqual(2);
  expect(comments[0].text).toEqual('This is the best movie ever!!!');
});
