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
    },
    video: {
      type: 'asset/resource'
    },
    pdf: {
      type: 'asset/resource'
    },
    images: {
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: _4kb
        }
      }
    },
    fonts: {
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: _4kb
        }
      }
    },
    svg: {
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: _4kb
        }
      }
    }
  }
);

module.exports = createAssetType;
