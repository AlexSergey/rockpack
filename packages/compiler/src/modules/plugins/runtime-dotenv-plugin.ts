import type { Compiler } from 'webpack';

import Dotenv from 'dotenv-webpack';

type DotenvOptions = NonNullable<ConstructorParameters<typeof Dotenv>[0]>;

// dotenv-webpack does not declare it, but it is the method its own apply() reads the files with.
type VariableSource = { gatherVariables(): Record<string, string> };

// webpack replaces placeholders such as `[name]` in a banner, so a value must not contain a plain `[`.
const toLiteral = (value: string): string => JSON.stringify(value).replaceAll('[', String.raw`\u005b`);

const makeDefaults = (variables: Readonly<Record<string, string>>): string => {
  const entries = Object.entries(variables).map(([key, value]) => `[${toLiteral(key)}, ${toLiteral(value)}]`);

  return `for (const [key, value] of [${entries.join(', ')}]) process.env[key] ??= value;`;
};

// Dotenv for a Node.js bundle that reads its environment at startup: the variables are not inlined, the bundle sets
// the ones its process does not have, before any module runs.
export class RuntimeDotenvPlugin {
  readonly #options: DotenvOptions;

  constructor(options: DotenvOptions) {
    this.#options = options;
  }

  apply(compiler: Compiler): void {
    const source = new Dotenv(this.#options) as unknown as VariableSource;

    new compiler.webpack.BannerPlugin({
      banner: makeDefaults(source.gatherVariables()),
      entryOnly: true,
      raw: true,
      test: /\.[cm]?js$/,
    }).apply(compiler);
  }
}
