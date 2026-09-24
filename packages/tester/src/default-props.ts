export type TesterOptions = {
  readonly prefix?: string;
  // Run tests one by one without cache (maxWorkers 1, runInBand, noCache); for suites that share ports or files.
  readonly serial?: boolean;
  readonly src?: string | string[];
  // Run only the spec files whose path matches one of these patterns (like `jest <pattern>`).
  readonly testPathPatterns?: string[];
  readonly watch?: boolean;
};

export const defaultProps: Required<TesterOptions> = {
  prefix: '(spec|test)',
  serial: false,
  src: './src',
  testPathPatterns: [],
  watch: false,
};
