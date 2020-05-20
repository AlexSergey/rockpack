const MODE = {
  development: 'development',
  test: 'test',
  production: 'production'
};
const isProduction = (): boolean => process.env.NODE_ENV === 'production';

const isNotProduction = (): boolean => process.env.NODE_ENV !== 'production';

export default MODE[process.env.NODE_ENV];

export { isProduction, isNotProduction };
