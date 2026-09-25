export type Problem = {
  readonly kind: ProblemKind;
  // `src/app.tsx:12:5`, relative to the project root when it is known.
  readonly location?: string;
  readonly message: string;
};

// The parts of a webpack StatsError the reporter reads.
export type StatsProblem = {
  readonly file?: string;
  readonly loc?: string;
  readonly message: string;
  readonly moduleName?: string;
};

// The parts of a fork-ts-checker issue the reporter reads.
export type TypeScriptIssue = {
  readonly code: string;
  readonly file?: string;
  readonly location?: { readonly start: { readonly column: number; readonly line: number } };
  readonly message: string;
};

type ProblemKind = 'Build' | 'CSS' | 'ESLint' | 'Module not found' | 'Stylelint' | 'Syntax' | 'TypeScript';

const MAX_LINES = 12;

const problem = (kind: ProblemKind, message: string, at?: string): Problem => ({
  kind,
  ...(at ? { location: at } : {}),
  message,
});

// eslint-disable-next-line no-control-regex -- colour codes of the tools' own formatters
const stripAnsi = (text: string): string => text.replace(/\u001B\[[0-9;]*m/g, '');

const tidy = (text: string, root: string): string =>
  stripAnsi(text)
    .split('\n')
    .filter((line) => !/^\s+at /.test(line))
    .map((line) => line.trimEnd())
    .join('\n')
    .replaceAll(`${root}/`, '')
    .trim();

const limit = (text: string): string => {
  const lines = text.split('\n');

  return lines.length <= MAX_LINES ? text : [...lines.slice(0, MAX_LINES), '…'].join('\n');
};

const relative = (file: string | undefined): string | undefined => file?.replace(/^\.\//, '');

// The module path without the loader chain webpack prefixes to it (`./src/a.css.webpack[...]!=!...!./src/a.css`).
const moduleFile = (moduleName: string | undefined): string | undefined => relative(moduleName?.split('!').at(-1));

const location = (source: StatsProblem): string | undefined => {
  const file = moduleFile(source.moduleName);
  const line = source.loc?.split(':')[0];

  return file && line ? `${file}:${line}` : file;
};

const afterFirst = (text: string, marker: string): string => {
  const index = text.indexOf(marker);

  return index < 0 ? text : text.slice(index + marker.length);
};

// One problem per webpack error, or none for the wrapper errors that repeat another one.
export const fromStatsProblem = (source: StatsProblem, root: string): Problem[] => {
  const text = tidy(source.message, root);

  if (text.startsWith('[stylelint]')) {
    return [problem('Stylelint', limit(afterFirst(text, '[stylelint]').trim()))];
  }
  if (text.startsWith('[eslint]')) {
    return [problem('ESLint', limit(afterFirst(text, '[eslint]').trim()))];
  }
  if (/^TS\d+:/.test(text)) {
    return [problem('TypeScript', limit(text), relative(source.file))];
  }
  if (text.startsWith('Module not found')) {
    return [problem('Module not found', afterFirst(text, 'Error: ').split('\n')[0] ?? text, location(source))];
  }
  if (text.includes('HookWebpackError')) {
    // mini-css-extract-plugin wraps the style loader's own error, which is reported separately.
    return [];
  }
  if (text.startsWith('Module build failed') && text.includes('babel-loader')) {
    const [firstLine = '', ...frame] = afterFirst(text, 'SyntaxError: ').split('\n');

    return [
      problem(
        'Syntax',
        limit([afterFirst(firstLine, ': '), ...frame].join('\n').trim()),
        moduleFile(source.moduleName),
      ),
    ];
  }
  if (text.startsWith('Module build failed')) {
    return [problem('CSS', limit(afterFirst(text, '\n').trim()), moduleFile(source.moduleName))];
  }

  return [problem('Build', limit(text), location(source))];
};

// An error that stopped the build before webpack produced stats (ESLint with failOnError, a crashed loader).
export const fromError = (error: Error, root: string): Problem[] => fromStatsProblem({ message: error.message }, root);

export const fromTypeScriptIssue = (issue: TypeScriptIssue, root: string): Problem => {
  const file = issue.file?.replaceAll(`${root}/`, '');
  const start = issue.location?.start;

  return problem(
    'TypeScript',
    `${issue.code}: ${issue.message}`,
    file && start ? `${file}:${String(start.line)}:${String(start.column)}` : file,
  );
};

// Problems reported by both compilers of an isomorphic build (or twice by one) are kept once.
export const uniqueProblems = (problems: readonly Problem[]): Problem[] => {
  const seen = new Set<string>();

  return problems.filter((item) => {
    const key = `${item.kind}|${item.location ?? ''}|${item.message}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);

    return true;
  });
};
