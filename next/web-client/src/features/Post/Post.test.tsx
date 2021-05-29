import { renderHook } from '@testing-library/react-hooks';
import { usePost } from './hooks';
import { createAppWrapper } from '../../tests/createAppWrapper';

test('Render Post from usePost()', async () => {
  const { result, waitForNextUpdate } = renderHook(() => usePost(13), {
    wrapper: createAppWrapper(),
  });

  try {
    await waitForNextUpdate();
  } catch (err) {
    expect(err.timeout)
      .toBeTruthy();
  }

  const [, , post] = result.current;

  expect(post.id)
    .toEqual(13);
  expect(post.text)
    .toEqual('<p>Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.</p><p><br /></p><p><strong>Director:</strong> Frank Darabont</p><p><strong>Writers:</strong> Stephen King (short story "Rita Hayworth and Shawshank Redemption"), Frank Darabont (screenplay)</p><p><strong>Stars:</strong> Tim Robbins, Morgan Freeman, Bob Gunton | See full cast &amp; crew</p>');
});
