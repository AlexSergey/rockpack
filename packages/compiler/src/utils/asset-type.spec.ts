import { createAssetType } from './asset-type.js';

describe('createAssetType', () => {
  describe('negative cases', () => {
    it('never inlines pdf and video files', () => {
      const { pdf, video } = createAssetType();

      expect([pdf.type, video.type]).toEqual(['asset/resource', 'asset/resource']);
      expect(pdf.parser).toBeUndefined();
      expect(video.parser).toBeUndefined();
    });
  });

  describe('positive cases', () => {
    it('inlines fonts, images and svg up to 4kb', () => {
      const { fonts, images, svg } = createAssetType();

      [fonts, images, svg].forEach((rule) => {
        expect(rule).toMatchObject({ parser: { dataUrlCondition: { maxSize: 4096 } }, type: 'asset' });
      });
    });

    it('emits each asset kind into its own static folder', () => {
      const { fonts, images, pdf, svg, video } = createAssetType();

      expect([fonts, images, pdf, svg, video].map((rule) => rule.generator?.filename)).toEqual([
        'static/fonts/[name].[hash][ext]',
        'static/images/[name].[hash][ext]',
        'static/pdf/[name].[hash][ext]',
        'static/svg/[name].[hash][ext]',
        'static/media/[name].[hash][ext]',
      ]);
    });

    it('returns a fresh object on every call', () => {
      expect(createAssetType()).not.toBe(createAssetType());
    });
  });
});
