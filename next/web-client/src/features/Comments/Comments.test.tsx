import { useComments } from './hooks';
import { createTestWrapper } from '../../tests/TestWrapper';

test('Comments test useComments()', async () => {
  let comments;

  await createTestWrapper(() => {
    const [, , data] = useComments(13);

    if (Array.isArray(data)) {
      comments = data;
    }

    return null;
  }, {});

  expect(comments.length)
    .toEqual(2);
  expect(comments[0].text)
    .toEqual('This is the best movie ever!!!');
});
