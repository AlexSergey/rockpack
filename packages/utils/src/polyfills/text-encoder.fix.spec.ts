import { TextDecoder, TextEncoder } from 'node:util';

describe('text-encoder polyfill', () => {
  describe('negative cases', () => {
    it('does not export anything', () => {
      jest.isolateModules(() => {
        expect(Object.keys(jest.requireActual('./text-encoder.fix'))).toEqual([]);
      });
    });
  });

  describe('positive cases', () => {
    it('installs TextEncoder and TextDecoder from node:util on the global object', () => {
      Reflect.deleteProperty(global, 'TextEncoder');
      Reflect.deleteProperty(global, 'TextDecoder');

      jest.isolateModules(() => {
        jest.requireActual('./text-encoder.fix');
      });

      expect(global.TextEncoder).toBe(TextEncoder);
      expect(global.TextDecoder).toBe(TextDecoder);
    });
  });
});
