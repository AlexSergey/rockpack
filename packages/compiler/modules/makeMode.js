const makeMode = () => {
    let mode = process.env.NODE_ENV || 'development';

    mode = ['development', 'production'].indexOf(mode) >= 0 ? mode : 'development';

    return mode;
};

module.exports = makeMode;