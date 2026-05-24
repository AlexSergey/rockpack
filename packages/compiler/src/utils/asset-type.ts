const _4kb = 4 * 1024;

interface AssetRule {
  generator?: { filename: string };
  parser?: { dataUrlCondition: { maxSize: number } };
  type: string;
}

interface AssetTypes {
  fonts: AssetRule;
  images: AssetRule;
  pdf: AssetRule;
  svg: AssetRule;
  video: AssetRule;
}

export const createAssetType = (): AssetTypes => ({
  fonts: {
    generator: { filename: 'static/fonts/[name].[hash][ext]' },
    parser: { dataUrlCondition: { maxSize: _4kb } },
    type: 'asset',
  },
  images: {
    generator: { filename: 'static/images/[name].[hash][ext]' },
    parser: { dataUrlCondition: { maxSize: _4kb } },
    type: 'asset',
  },
  pdf: {
    generator: { filename: 'static/pdf/[name].[hash][ext]' },
    type: 'asset/resource',
  },
  svg: {
    generator: { filename: 'static/svg/[name].[hash][ext]' },
    parser: { dataUrlCondition: { maxSize: _4kb } },
    type: 'asset',
  },
  video: {
    generator: { filename: 'static/media/[name].[hash][ext]' },
    type: 'asset/resource',
  },
});
