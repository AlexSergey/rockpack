import HelloWorld from './index';

const mock = 'Hello world';

test('Test library', () => {
  const hello = new HelloWorld(mock);
  expect(hello.show())
    .toBe(mock);
});
