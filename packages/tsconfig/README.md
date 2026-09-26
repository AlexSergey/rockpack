# @rockpack/tsconfig

Strict TypeScript base configuration for React and Node.js projects.

## Install

```shell
npm install @rockpack/tsconfig --save-dev
```

## Use

```json
{
  "extends": "@rockpack/tsconfig",
  "include": ["src"]
}
```

For Node.js code without the DOM libs extend `@rockpack/tsconfig/tsconfig.node.json`.

## What it turns on

`tsconfig.json`:

- Type checking: `strict` (including `strictPropertyInitialization`), `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `useUnknownInCatchVariables`, `forceConsistentCasingInFileNames` and `skipLibCheck`.
- Modules: `module: ESNext`, `moduleResolution: bundler`, `verbatimModuleSyntax`, `esModuleInterop`, `resolveJsonModule` and `allowImportingTsExtensions`.
- Output: `target: ESNext`, `jsx: react-jsx`, `lib: ["ESNext", "dom", "dom.iterable"]`, `sourceMap`, `preserveConstEnums`, `removeComments: false` and `newLine: lf`.

`tsconfig.node.json` extends it with `lib: ["ESNext"]` (no DOM) and `types: ["node"]`, so the project needs `@types/node` installed.

Neither config sets `outDir`, `rootDir`, `noEmit` or `types` (except `["node"]` above). TypeScript 6 loads no `@types` package unless it is listed in `types`, so add the ones your code uses, for example `"types": ["node", "jest"]`.

Because of `allowImportingTsExtensions` (`import { a } from './a.ts'`), `tsc` accepts the config only with `noEmit`, `emitDeclarationOnly` or `rewriteRelativeImportExtensions`. That fits projects where a bundler or Babel emits the JavaScript and `tsc` only checks types or writes declarations. To emit JavaScript with `tsc`, set `"allowImportingTsExtensions": false` or `"rewriteRelativeImportExtensions": true`.

`strictPropertyInitialization` is no longer turned off: it follows `strict`, so class properties must be initialized or declared with `!`. Set it to `false` in your `tsconfig.json` to keep the old behavior.

Because of `noPropertyAccessFromIndexSignature`, index signatures are read with brackets, for example `process.env['API_URL']`; webpack and dotenv still inline them. Set the flag to `false` in your `tsconfig.json` to turn it off.

## Entry points

The package has an `exports` map, so only these paths resolve:

- `@rockpack/tsconfig` and `@rockpack/tsconfig/tsconfig.json` - the base config
- `@rockpack/tsconfig/tsconfig.node.json` - the Node.js config without the DOM libs
- `@rockpack/tsconfig/package.json`

Other paths, including `@rockpack/tsconfig/tsconfig.node` without the `.json` extension, fail with `File '...' not found`.

## The MIT License

MIT
