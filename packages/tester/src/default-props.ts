export type TesterOptions = {
  readonly prefix?: string;
  // Run tests one by one without cache (maxWorkers 1, runInBand, noCache); for suites that share ports or files.
  readonly serial?: boolean;
  readonly src?: string | string[];
  readonly watch?: boolean;
};

export const defaultProps: Required<TesterOptions> = {
  prefix: '(spec|test)',
  serial: false,
  src: './src',
  watch: false,
};
