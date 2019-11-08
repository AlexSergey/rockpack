const makeResolve = () => {
    return {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.mjs',
            '.vue'
        ]
    };
};

module.exports = makeResolve;
