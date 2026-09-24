import { idMaker, timeout } from './index';

describe('idMaker', () => {
  describe('negative cases', () => {
    it('stops after three ids', () => {
      const gen = idMaker();
      gen.next();
      gen.next();
      gen.next();

      expect(gen.next().done).toBe(true);
    });
  });

  describe('positive cases', () => {
    it('yields 0, 1 and 2', () => {
      expect([...idMaker()]).toEqual([0, 1, 2]);
    });
  });
});

describe('timeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('negative cases', () => {
    it('is still pending before the delay passes', async () => {
      const onResolve = jest.fn();
      void timeout(1000).then(onResolve);

      await jest.advanceTimersByTimeAsync(999);

      expect(onResolve).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('resolves after the delay', async () => {
      const onResolve = jest.fn();
      void timeout(1000).then(onResolve);

      await jest.advanceTimersByTimeAsync(1000);

      expect(onResolve).toHaveBeenCalledTimes(1);
    });
  });
});
