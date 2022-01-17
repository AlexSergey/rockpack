const _4kb = 4 * 1024;

const createAssetType = conf => (
  conf.webview ? {
    asyncAssets: {
      type: 'asset/inline'
    },
    video: {
      type: 'asset/inline'
    },
    pdf: {
      type: 'asset/inline'
    },
    images: {
      type: 'asset/inline'
    },
    fonts: {
      type: 'asset/inline'
    },
    svg: {
      type: 'asset/inline'
    }
  } : {
    asyncAssets: {
      type: 'asset/resource',
      generator: {
        filename: 'static/html/[name].[hash][ext]'
      }
    },
    video: {
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    },
    pdf: {
      type: 'asset/resource',
      generator: {
        filename: 'static/pdf/[name].[hash][ext]'
      }
    },
    images: {
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: _4kb
        }
      },
      generator: {
        filename: 'static/images/[name].[hash][ext]'
      }
    },
    fonts: {
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: _4kb
        }
      },
      generator: {
        filename: 'static/fonts/[name].[hash][ext]'
      }
    },
    svg: {
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: _4kb
        }
      },
      generator: {
        filename: 'static/svg/[name].[hash][ext]'
      }
    }
  }
);

module.exports = createAssetType;
