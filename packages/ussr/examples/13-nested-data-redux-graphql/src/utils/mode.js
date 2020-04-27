const MODE = {
  development: 'development',
  test: 'test',
  production: 'production'
};
const isProduction = () => process.env.NODE_ENV === 'production';

const isNotProduction = () => process.env.NODE_ENV !== 'production';

export default MODE[process.env.NODE_ENV];

export { isProduction, isNotProduction };
