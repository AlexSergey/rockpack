import fileTransformer from './file-transformer.js';

describe('fileTransformer', () => {
  describe('negative cases', () => {
    it('exports the bare filename when it has no directory', () => {
      expect(fileTransformer.process('<svg />', 'logo.svg')).toEqual({ code: 'module.exports = "logo.svg";' });
    });
  });

  describe('positive cases', () => {
    it('exports the basename of the transformed file', () => {
      expect(fileTransformer.process('<svg />', '/a/b/logo.svg')).toEqual({ code: 'module.exports = "logo.svg";' });
    });
  });
});
