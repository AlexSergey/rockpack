import sum from './sum';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('1 + 1 to equal 2', () => {
  const res = 1 + 1;
  expect(res).toBe(2);
  expect(res).toBeGreaterThan(1);
  expect(typeof res).toBe('number');
});
