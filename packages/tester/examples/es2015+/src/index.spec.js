import { idMaker, timeout } from './index';

test('generator test', () => {
  var gen = idMaker();
  expect(gen.next().value).toBe(0);
  expect(gen.next().value).toBe(1);
  expect(gen.next().value).toBe(2);
});
test('timeout test', async () => {
  const start = new Date();
  await timeout(1000);
  const stop = new Date();
  expect(stop - start >= 1000).toBe(true);
});
