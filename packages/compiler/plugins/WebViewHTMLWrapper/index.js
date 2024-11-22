const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('node:fs');

const wrapper = (html) => `module.exports = ${JSON.stringify(html)};`;

class WebViewHTMLWrapper {
  constructor(props) {
    this.options = props;
  }

  apply(compiler) {
    let webviewHTML;
    compiler.hooks.compilation.tap('WebViewHTMLWrapperPlugin', (compilation) => {
      if (HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('WebViewHTMLWrapperPlugin', (data, callback) => {
          webviewHTML = data.html;
          callback(null, data);
        });
      }
    });
    compiler.hooks.afterEmit.tapAsync('WebViewHTMLWrapperPlugin', (compilation, callback) => {
      if (typeof webviewHTML === 'string') {
        createWebView.call(this, webviewHTML);
        webviewHTML = null;
      }
      callback();
    });
  }
}

function createWebView(html) {
  fs.writeFileSync(this.options.dist, wrapper(html));
}

module.exports = WebViewHTMLWrapper;
