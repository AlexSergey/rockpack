/**
 * @jest-environment node
 */
import { isNodeJS } from './index';

describe('nodejs env testing', () => {
  test('isNodeJS', () => {
    expect(isNodeJS()).toBe(true);
  });

  test('is browser', () => {
    expect(typeof document).toBe('undefined');
  });
});
