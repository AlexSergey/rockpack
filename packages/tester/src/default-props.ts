export interface TesterOptions {
  readonly prefix?: string;
  readonly src?: string | string[];
  readonly watch?: boolean;
}

export const defaultProps: Required<TesterOptions> = {
  prefix: '(spec|test)',
  src: './src',
  watch: false,
};
