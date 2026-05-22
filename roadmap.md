## Roadmap

[9.0.0]

- [ ] Change eslint ignore to:
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
- [ ] Rewrite the code to TS
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
  - [ ] Make meta config for rockpack/compiler
  - [ ] Rewrite to TS:
    - [✅] babel
    - [✅] codestyle
    - [ ] compiler
    - [ ] starter
    - [ ] tester
      - [❌] Drop commonjs babel plugin
    - [❌] tsconfig
    - [ ] utils
- [ ] e2e to type modules
- [ ] update e2e deps
- [✅] npm run build priority
- [ ] Extract examples to the root, connect to version, updater
- [ ] Update lint-staged to 17
- [ ] Fix husky initializtion for starter project
  - [ ] Add pre-hooks
- [ ] Unit tests for all modules
