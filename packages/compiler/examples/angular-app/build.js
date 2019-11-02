let { frontendCompiler } = require('../../index');
const path = require('path');

frontendCompiler({
    banner: true,
    src: './src/main.ts',
    html: {
        template: path.resolve(__dirname, './index.ejs')
    }
});