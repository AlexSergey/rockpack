import { watch } from 'node:fs';

import { watchSources } from './watch-sources.js';

type Listener = () => void;

// Every fs.watch call records its folder, options and listener; close() is a spy.
const watchers: { close: jest.Mock; dir: string; listener: Listener; options: unknown }[] = [];

jest.mock('node:fs', () => ({
  watch: jest.fn((dir: string, options: unknown, listener: Listener) => {
    const watcher = { close: jest.fn(), dir, listener, options };
    watchers.push(watcher);

    return watcher;
  }),
}));

const emit = (index = 0): void => {
  watchers[index]?.listener();
};

describe('watchSources', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    watchers.length = 0;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('does not call back after stop, even for a change still waiting for the debounce', () => {
      const onChange = jest.fn();
      const stop = watchSources(['/project/src'], onChange, 100);

      emit();
      stop();
      jest.advanceTimersByTime(500);

      expect(onChange).not.toHaveBeenCalled();
      expect(watchers[0]?.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('positive cases', () => {
    it('watches each folder once, recursively', () => {
      watchSources(['/project/src', '/project/src', '/project/lib'], jest.fn());

      expect(watch).toHaveBeenCalledTimes(2);
      expect(watchers.map(({ dir, options }) => [dir, options])).toEqual([
        ['/project/src', { recursive: true }],
        ['/project/lib', { recursive: true }],
      ]);
    });

    it('calls back once for a burst of changes, after the debounce', () => {
      const onChange = jest.fn();
      watchSources(['/project/src', '/project/lib'], onChange, 100);

      emit(0);
      jest.advanceTimersByTime(50);
      emit(1);
      jest.advanceTimersByTime(99);

      expect(onChange).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
