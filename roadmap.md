## Roadmap

[9.0.0]

- [❌] Change eslint ignore to:
```ts
'**/coverage/**',
'**/coverage-e2e/**',
'**/test-reports/**',
'**/docs/*',
'**/build/**',
'**/lib/**',
'**/dist/**',
'**/public/**'
```
- [✅] Rewrite the code to TS
  - [✅] Make sourceCompiler independent compilation module to build packages
  - [✅] Rewrite sourceCompiler:

```ts
// 1. Copy non-ts files first:

const fs = require('fs');
const path = require('path');

fs.cpSync(
  path.join(__dirname, '../src'),
  path.join(__dirname, '../dist'),
  {
    recursive: true,
    filter(src) {
      return !src.endsWith('.ts') &&
        !src.endsWith('.tsx');
    },
  }
);

// 2. Transpile to esm, cjs via TSC
```

  - [✅] Make simple transpiling (type module, transpile to esm, cjs, types)
  - [✅] Rewrite to TS:
    - [✅] babel
    - [✅] codestyle
    - [✅] compiler
      - [✅] Basic TS transformation
      - [✅] Fix all eslint errors
      - [✅] Improve valid-types
      - [✅] drop _ fields from conf
        - [✅] Make meta config for rockpack/compiler
      - [✅] extract messages from conf
    - [✅] starter
    - [✅] tester
      - [❌] Drop commonjs babel plugin
    - [❌] tsconfig
    - [✅] utils
- [✅] e2e to type modules
- [✅] update e2e deps
- [✅] npm run build priority
- [✅] Extract examples to the root, connect to version, updater
  - [✅] all examples to the latest react and TS
  - [✅] tester
  - [✅] compiler
    - [❌] add type commonjs example to test cjs version
- [✅] Update lint-staged to 17
- [✅] make all deps in starter templates are updatable
- [ ] Fix husky initialization for starter project
  - [ ] Add pre-hooks
- [✅] add ts lint to e2e
- [✅] Transform all configs, scripts to TS (example: tsx scripts.build.ts)
- [❌] WebpackBar [not working] - https://github.com/unjs/webpackbar/tree/main
- [✅] Fix .eslintrc in webpack plugin
- [✅] Drop rockpack.babel.js
- [✅] Drop jest.extend
- [✅] Clean before build
