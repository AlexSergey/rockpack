/**
 * @jest-environment node
 */
import { isBackend, isClient, clone } from './utils';

describe('Utils tests', () => {
  it('isBackend utils test', () => {
    expect(isBackend())
      .toBe(true);
  });

  it('isClient utils test', () => {
    expect(isClient())
      .toBe(false);
  });

  it('clone utils test', () => {
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
