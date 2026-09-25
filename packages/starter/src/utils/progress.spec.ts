import { startProgress } from './progress.js';

describe('startProgress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('negative cases', () => {
    it('shows an empty text and no timer after stop without messages', () => {
      const spinner = { stop: jest.fn(), text: 'previous' };

      const stop = startProgress(spinner, [], 1000);
      stop();

      expect(spinner.text).toBe('');
      expect(jest.getTimerCount()).toBe(0);
    });
  });

  describe('positive cases', () => {
    it('moves through the messages and stays on the last one', () => {
      const spinner = { stop: jest.fn(), text: '' };
      const texts: string[] = [];

      startProgress(spinner, ['one', 'two', 'three'], 1000);
      [0, 1, 2, 3].forEach(() => {
        texts.push(spinner.text);
        jest.advanceTimersByTime(1000);
      });

      expect(texts).toEqual(['one', 'two', 'three', 'three']);
      expect(jest.getTimerCount()).toBe(0);
    });

    it('stops the timer and the spinner', () => {
      const spinner = { stop: jest.fn(), text: '' };

      const stop = startProgress(spinner, ['one', 'two'], 1000);
      stop();
      jest.advanceTimersByTime(5000);

      expect(spinner.text).toBe('one');
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
