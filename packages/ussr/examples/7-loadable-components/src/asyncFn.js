export const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));
