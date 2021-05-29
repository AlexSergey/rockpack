import { renderHook } from '@testing-library/react-hooks';
import { useImage } from './hooks';
import { createAppWrapper } from '../../tests/createAppWrapper';

it('Render Image from useImage()', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useImage(), {
    wrapper: createAppWrapper(),
  });

  try {
    await waitForNextUpdate({ timeout: 100 });
  } catch (err) {
    expect(err.timeout)
      .toBeTruthy();
  }
  const [, , url] = result.current;

  expect(url)
    .toEqual('https://picsum.photos/id/0/5616/3744');
});
