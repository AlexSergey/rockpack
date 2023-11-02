const _4kb = 4 * 1024;

const createAssetType = (conf) =>
  conf.webview
    ? {
        asyncAssets: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          type: 'asset/inline',
        },
        fonts: {
          type: 'asset/inline',
        },
        images: {
          type: 'asset/inline',
        },
        pdf: {
          type: 'asset/inline',
        },
        svg: {
          type: 'asset/inline',
        },
        video: {
          type: 'asset/inline',
        },
      }
    : {
        asyncAssets: {
          generator: {
            filename: 'static/html/[name].[hash][ext]',
          },
          // eslint-disable-next-line sonarjs/no-duplicate-string
          type: 'asset/resource',
        },
        fonts: {
          generator: {
            filename: 'static/fonts/[name].[hash][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: _4kb,
            },
          },
          type: 'asset',
        },
        images: {
          generator: {
            filename: 'static/images/[name].[hash][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: _4kb,
            },
          },
          type: 'asset',
        },
        pdf: {
          generator: {
            filename: 'static/pdf/[name].[hash][ext]',
          },
          type: 'asset/resource',
        },
        svg: {
          generator: {
            filename: 'static/svg/[name].[hash][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: _4kb,
            },
          },
          type: 'asset',
        },
        video: {
          generator: {
            filename: 'static/media/[name].[hash][ext]',
          },
          type: 'asset/resource',
        },
      };

module.exports = createAssetType;
