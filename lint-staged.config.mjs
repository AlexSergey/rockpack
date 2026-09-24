import { existsSync, globSync, readFileSync } from 'node:fs';
import path from 'node:path';

// ESLint configs resolve tsconfig and package.json from the working directory,
// so staged files are linted per workspace with the workspace as cwd.
const { workspaces } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const workspaceDirs = workspaces
  .flatMap((pattern) => globSync(pattern))
  .filter((dir) => existsSync(path.join(dir, 'package.json')))
  .filter((dir) => ['ts', 'js', 'mjs', 'cjs'].some((ext) => existsSync(path.join(dir, `eslint.config.${ext}`))))
  .map((dir) => path.resolve(dir))
  .sort((a, b) => b.length - a.length);

// e2e fixture projects are inputs of the suites: deliberately broken code must stay as it is.
const isE2eFixture = (file) => /[/\\]e2e[/\\][^/\\]+[/\\]fixtures[/\\]/.test(file);

const groupByWorkspace = (files) => {
  const groups = new Map();

  for (const file of files.filter((staged) => !isE2eFixture(staged))) {
    const dir = workspaceDirs.find((workspace) => file.startsWith(`${workspace}${path.sep}`));
    if (dir) {
      groups.set(dir, [...(groups.get(dir) ?? []), file]);
    }
  }

  return groups;
};

export default {
  '*.{ts,tsx,js,jsx,mjs,cjs,json}': (files) =>
    [...groupByWorkspace(files)].map(
      ([dir, dirFiles]) =>
        `npm exec --workspace=${path.relative(process.cwd(), dir)} -- eslint --fix --no-warn-ignored ${dirFiles.join(' ')}`,
    ),
};
