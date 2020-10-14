const MODE = {
  development: 'development',
  production: 'production',
};

const isProduction = (): boolean => process.env.NODE_ENV === 'production';

const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';

export default MODE[process.env.NODE_ENV];

export { isProduction, isDevelopment };
