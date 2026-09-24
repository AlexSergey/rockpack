import type { MultiStats, Stats } from 'webpack';

import formatMessages from 'webpack-format-messages';

import { log } from './log.js';

jest.mock('webpack-format-messages', () => jest.fn());

const formatMessagesMock = formatMessages as unknown as jest.Mock<{ errors: string[]; warnings: string[] }>;

const createStats = (durationMs: number): Stats => ({ endTime: 1000 + durationMs, startTime: 1000 }) as Stats;

describe('log', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    formatMessagesMock.mockReturnValue({ errors: [], warnings: [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it.each([null, undefined])('prints nothing for %p stats', (stats) => {
      log(stats);

      expect(logSpy).not.toHaveBeenCalled();
    });

    it('prints every error of a failed compilation', () => {
      formatMessagesMock.mockReturnValue({ errors: ['error one', 'error two'], warnings: [] });

      log(createStats(0));

      expect(logSpy.mock.calls.slice(1)).toEqual([['Failed to compile.'], ['error one'], ['error two']]);
    });
  });

  describe('positive cases', () => {
    it('prints the duration and success of a single compilation', () => {
      log(createStats(65_000));

      expect(logSpy.mock.calls).toEqual([['[COMPILE]', '1:5 minutes'], ['Compiled successfully!']]);
    });

    it('keeps hours in the minutes of a long compilation', () => {
      log(createStats(3_725_000));

      expect(logSpy).toHaveBeenCalledWith('[COMPILE]', '62:5 minutes');
    });

    it('prints every compilation of multi stats', () => {
      const stats = { stats: [createStats(1000), createStats(2000)] } as MultiStats;

      log(stats);

      expect(formatMessagesMock).toHaveBeenCalledTimes(2);
      expect(logSpy).toHaveBeenCalledWith('[COMPILE]', '0:2 minutes');
    });
  });
});
