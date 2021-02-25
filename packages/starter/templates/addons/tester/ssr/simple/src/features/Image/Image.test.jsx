import useImage from './hooks';
import createTestWrapper from '../../tests/TestWrapper';

test('Render Image from useImage()', async () => {
  let src;

  await createTestWrapper(() => {
    const [, , url] = useImage();

    if (typeof url === 'string') {
      src = url;
    }

    return null;
  }, {});

  expect(typeof src === 'string')
    .toEqual(true);
  expect(src)
    .toEqual('https://picsum.photos/id/0/5616/3744');
});
