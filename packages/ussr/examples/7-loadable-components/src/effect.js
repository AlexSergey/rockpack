export const effect = () => {
  return new Promise((resolve) => setTimeout(() => resolve({ test: 'data' }), 1000));
};
