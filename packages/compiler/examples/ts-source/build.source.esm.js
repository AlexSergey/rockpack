const { tsSourceCompiler } = require('../../');

tsSourceCompiler({
    dist: './lib/cjs',
    tsconfig: './tsconfig.esm.json'
});
