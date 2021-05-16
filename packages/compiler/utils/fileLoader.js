const createFileLoader = conf => (
  conf.webview ? {
    asyncAssets: {
      loader: require.resolve('url-loader')
    },
    video: {
      loader: require.resolve('url-loader')
    },
    pdf: {
      loader: require.resolve('url-loader')
    },
    images: {
      loader: require.resolve('url-loader')
    },
    fonts: {
      loader: require.resolve('url-loader')
    },
    svg: {
      loader: require.resolve('url-loader')
    }
  } : {
    asyncAssets: {
      loader: require.resolve('file-loader'),
      options: {
        name: '[name].[hash].[ext]'
      }
    },
    video: {
      loader: require.resolve('file-loader'),
      options: {
        name: 'media/[name].[hash].[ext]'
      }
    },
    pdf: {
      loader: require.resolve('file-loader'),
      options: {
        name: 'images/[name].[hash].[ext]'
      }
    },
    images: {
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'images/[name].[hash].[ext]'
      }
    },
    fonts: {
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'fonts/[name].[hash].[ext]'
      }
    },
    svg: {
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'svg/[path][name].[ext]',
      }
    }
  }
);

module.exports = createFileLoader;
