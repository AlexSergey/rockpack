import HelloWorld from './index.js';

const mock = 'Hello world';

it('Test library', () => {
  const hello = new HelloWorld(mock);

  expect(hello.show()).toBe(mock);
});
