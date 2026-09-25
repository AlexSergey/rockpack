import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

type TypeScriptPackage = {
  readonly bin?: Readonly<Record<string, string>>;
};

const _require = createRequire(import.meta.url);

const findTsc = (require: NodeJS.Require): string | undefined => {
  let packageJson: string;
  try {
    packageJson = require.resolve('typescript/package.json');
  } catch {
    return undefined;
  }
  const { bin } = JSON.parse(readFileSync(packageJson, 'utf8')) as TypeScriptPackage;
  const tsc = bin?.['tsc'];

  return tsc === undefined ? undefined : path.join(path.dirname(packageJson), tsc);
};

// The tsc binary of the project's own TypeScript, so its version checks the types; the compiler's otherwise.
export const resolveTsc = (root: string): string => {
  const tsc = [createRequire(path.join(root, 'package.json')), _require]
    .map(findTsc)
    .find((file) => file !== undefined && existsSync(file));
  if (tsc === undefined) {
    throw new Error('TypeScript not found: install typescript to check types and generate declarations');
  }

  return tsc;
};
