import { idMaker, timeout } from './index';

test('generator test', () => {
  const gen = idMaker();
  expect(gen.next().value).toBe(0);
  expect(gen.next().value).toBe(1);
  expect(gen.next().value).toBe(2);
});

test('timeout test', async () => {
  const start = Date.now();
  await timeout(1000);
  const stop = Date.now();
  expect(stop - start >= 1000).toBe(true);
});
