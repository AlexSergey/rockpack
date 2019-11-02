const MODE = {
    development: 'development',
    test: 'test',
    production: 'production'
};

let isDevelopment = MODE[process.env.NODE_ENV] === 'development';

let notProduction = MODE[process.env.NODE_ENV] !== 'production';

export { isDevelopment, notProduction };
