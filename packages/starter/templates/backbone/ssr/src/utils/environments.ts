const MODE = {
  development: 'development',
  production: 'production',
};

const isProduction = (): boolean => process.env.NODE_ENV === 'production';

const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';

const mode = MODE[process.env.NODE_ENV as 'development' | 'production'];

export { isDevelopment, isProduction, mode };
