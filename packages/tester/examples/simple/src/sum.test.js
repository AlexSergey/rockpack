import sum from './sum';

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('1 + 1 to equal 2', () => {
    expect(1 + 1)
        .toBe(2)
        .toBeGreaterThan(1)
        .toBeNumber();
});
