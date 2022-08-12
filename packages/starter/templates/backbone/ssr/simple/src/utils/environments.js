const MODE = {
  development: 'development',
  production: 'production',
};

const isProduction = () => process.env.NODE_ENV === 'production';

const isDevelopment = () => process.env.NODE_ENV === 'development';

const mode = MODE[process.env.NODE_ENV];

export { isProduction, isDevelopment, mode };
