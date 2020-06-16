/**
 * @jest-environment node
 */
import { isBackend, isClient, clone } from './utils';

describe('Utils tests', () => {
  test('isBackend utils test', () => {
    expect(isBackend())
      .toBe(true);
  });

  test('isClient utils test', () => {
    expect(isClient())
      .toBe(false);
  });

  test('clone utils test', () => {
    expect(clone({
      app: {
        foo: 'bar'
      }
    }))
      .toStrictEqual({
        app: {
          foo: 'bar'
        }
      });
  });
});
