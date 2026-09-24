import type { Config } from '@jest/types';

export type CoverageOptions = {
  // Globs of the files to count; defaults to every source file under `src`.
  readonly collectCoverageFrom?: string[];
  readonly reporters?: Config.InitialOptions['coverageReporters'];
  // Global coverage thresholds in percent.
  readonly thresholds?: {
    readonly branches?: number;
    readonly functions?: number;
    readonly lines?: number;
    readonly statements?: number;
  };
};

export type TesterOptions = {
  // Collect coverage outside watch mode (default), turn it off with false, or adjust it.
  readonly coverage?: boolean | CoverageOptions;
  readonly prefix?: string;
  // Run tests one by one without cache (maxWorkers 1, runInBand, noCache); for suites that share ports or files.
  readonly serial?: boolean;
  readonly src?: string | string[];
  // Run only the spec files whose path matches one of these patterns (like `jest <pattern>`).
  readonly testPathPatterns?: string[];
  readonly watch?: boolean;
};

export const defaultProps: Required<TesterOptions> = {
  coverage: true,
  prefix: '(spec|test)',
  serial: false,
  src: './src',
  testPathPatterns: [],
  watch: false,
};
