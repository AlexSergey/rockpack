# @rockpack/utils

Small helpers shared by the Rockpack packages. They are published for build scripts too.

## Install

```shell
npm install @rockpack/utils --save-dev
```

## API

### `getMode()` / `getMode(modes, defaultMode, { argv?, env? })`

The build mode from `--mode=<mode>` (or `--mode <mode>`), then `NODE_ENV`, then the default. A value that is not in `modes` falls back to the default. Without arguments it returns `'development' | 'production'`, exported as the `DefaultMode` type. `argv` (without the node binary and script) and `env` default to the process; their type is exported as `ModeSources`.

```ts
import { getMode } from '@rockpack/utils';

getMode(); // 'development' | 'production'
getMode(['development', 'production', 'test'], 'test', { argv: ['--mode=production'], env: {} }); // 'production'
```

### `setMode(modes, defaultMode, { argv?, env? })`

Resolves the mode like `getMode` and writes it to `NODE_ENV` and `BABEL_ENV` of `env` (the process environment by default).

### `readPackageJson(dir)`

The parsed `package.json` of a folder, or `undefined` when it is missing or not valid JSON. The `PackageJson` type is exported.

### `packageRoot(import.meta.url)`

The nearest folder with a `package.json` above the calling module, the same from `src` and from a built `lib` folder.

### `getRootRequireDir(script?)`

The project folder of a build: the folder of the running script (`process.argv[1]`, the `scripts.build.mts` path), not `process.cwd()`.

### `isRecord(value)` / `isString(value)`

Type guards: a plain object (including `Object.create(null)`) and a string.

### `getMajorVersion(version)`

The major version of the lowest version a semver range allows, for example `getMajorVersion('^19.2.0')` is `19`; throws for an invalid range.

### `@rockpack/utils/polyfills/text-encoder.fix`

Adds `TextEncoder`/`TextDecoder` to jsdom test environments; `@rockpack/tester` loads it for you.

## The MIT License

MIT
