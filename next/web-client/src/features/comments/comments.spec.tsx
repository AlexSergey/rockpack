import { renderHook, waitFor } from '@testing-library/react';

import { createAppWrapper } from '../../tests/create-app-wrapper';
import { sleep } from '../../tests/helpers';
import { useComments } from './hooks';

test('Comments test useComments()', async () => {
  const { result } = renderHook(() => useComments(13), {
    wrapper: createAppWrapper(),
  });

  try {
    await waitFor(() => sleep(100));
  } catch (err) {
    expect(err.timeout).toBeTruthy();
  }

  const [, , comments] = result.current;

  expect(comments.length).toEqual(2);
  expect(comments[0].text).toEqual('This is the best movie ever!!!');
});
