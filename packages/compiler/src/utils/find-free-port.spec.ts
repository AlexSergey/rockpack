import fp from 'find-free-port';

import { fpPromise } from './find-free-port.js';

jest.mock('find-free-port', () => jest.fn());

type FpCallback = (error: Error | null, port: number) => void;

const fpMock = fp as unknown as jest.Mock<void, [number, FpCallback]>;

describe('fpPromise', () => {
  describe('negative cases', () => {
    it('rejects when no free port is found', async () => {
      const error = new Error('no free port');
      fpMock.mockImplementation((_port, callback) => callback(error, 0));

      await expect(fpPromise(3000)).rejects.toBe(error);
    });
  });

  describe('positive cases', () => {
    it('resolves the first free port from the start port', async () => {
      fpMock.mockImplementation((_port, callback) => callback(null, 3001));

      await expect(fpPromise(3000)).resolves.toBe(3001);
      expect(fpMock).toHaveBeenCalledWith(3000, expect.any(Function));
    });
  });
});
