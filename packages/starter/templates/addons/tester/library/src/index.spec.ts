import HelloWorld from './index';

describe('HelloWorld', () => {
  describe('negative cases', () => {
    it('keeps an empty name empty', () => {
      expect(new HelloWorld('').show()).toBe('');
    });
  });

  describe('positive cases', () => {
    it('shows the name it was created with', () => {
      expect(new HelloWorld('Hello world').show()).toBe('Hello world');
    });
  });
});
