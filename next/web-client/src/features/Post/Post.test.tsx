import { usePost } from './hooks';
import { createTestWrapper } from '../../tests/TestWrapper';

test('Render Post from usePost()', async () => {
  let post;

  await createTestWrapper(() => {
    const [, , data] = usePost(13);

    if (!!data && Object.keys(data).length > 0) {
      post = data;
    }

    return null;
  }, {});

  expect(post.id)
    .toEqual(13);
  expect(post.text)
    .toEqual('<p>Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.</p><p><br /></p><p><strong>Director:</strong> Frank Darabont</p><p><strong>Writers:</strong> Stephen King (short story "Rita Hayworth and Shawshank Redemption"), Frank Darabont (screenplay)</p><p><strong>Stars:</strong> Tim Robbins, Morgan Freeman, Bob Gunton | See full cast &amp; crew</p>');
});
