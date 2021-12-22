const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const wrapper = (html) => (
  `module.exports = ${JSON.stringify(html)};`
);

function createWebView(html) {
  fs.writeFileSync(this.options.dist, wrapper(html));
}

class WebViewHTMLWrapper {
  constructor(props) {
    this.options = props;
  }

  apply(compiler) {
    let webviewHTML;
    compiler.hooks.compilation.tap('WebViewHTMLWrapperPlugin', (compilation) => {
      if (HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation)
          .beforeEmit
          .tapAsync('WebViewHTMLWrapperPlugin', (data, callback) => {
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

module.exports = WebViewHTMLWrapper;
