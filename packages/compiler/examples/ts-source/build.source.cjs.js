const { tsSourceCompiler } = require('../../');

tsSourceCompiler({
    dist: './lib/cjs',
    tsconfig: './tsconfig.cjs.json'
});
