import React from 'react';
import { mount } from 'enzyme';
import { usePosts } from './hooks';
import { createTestWrapper } from '../../tests/TestWrapper';
import { sleep } from '../../tests/utils';

test('Render Posts from usePosts()', async () => {
  let posts;

  const TestWrapper = createTestWrapper(() => {
    const [, , data] = usePosts();

    if (Array.isArray(data) && data.length > 0) {
      posts = data;
    }

    return null;
  }, {});

  mount(<TestWrapper />);

  await sleep(1000);

  expect(posts[0].id)
    .toEqual(13);
  expect(posts[0].title)
    .toEqual('The Shawshank Redemption');
});
