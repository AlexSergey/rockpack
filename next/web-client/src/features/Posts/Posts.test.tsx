import { usePosts } from './hooks';
import { createTestWrapper } from '../../tests/TestWrapper';

test('Render Posts from usePosts()', async () => {
  let posts;

  await createTestWrapper(() => {
    const [, , data] = usePosts();

    if (Array.isArray(data) && data.length > 0) {
      posts = data;
    }

    return null;
  }, {});

  expect(posts[0].id)
    .toEqual(13);
  expect(posts[0].title)
    .toEqual('The Shawshank Redemption');
});
