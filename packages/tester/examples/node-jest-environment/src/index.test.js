/**
 * @jest-environment node
 */
const { isNodeJS } = require('./index');

describe('nodejs env testing', () => {
  test('isNodeJS', () => {
    expect(isNodeJS()).toBe(true);
  });

  test('is browser', () => {
    expect(typeof document).toBe('undefined');
  });
});
