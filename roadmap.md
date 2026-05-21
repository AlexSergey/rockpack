## Roadmap

[9.0.0]

- Change eslint ignore to:
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
- Rewrite the code to TS
- Update lint-staged to 17
- Rewrite sourceCompiler:

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

- Unit tests for all modules
