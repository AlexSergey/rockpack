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

`strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `useUnknownInCatchVariables` and `verbatimModuleSyntax`, with `moduleResolution: bundler`, `jsx: react-jsx` and ESNext output.

Because of `noPropertyAccessFromIndexSignature`, index signatures are read with brackets, for example `process.env['API_URL']`; webpack and dotenv still inline them. Set the flag to `false` in your `tsconfig.json` to turn it off.

## The MIT License

MIT
