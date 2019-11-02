const makeResolve = () => {
    return {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.vue'
        ]
    };
};

module.exports = makeResolve;
