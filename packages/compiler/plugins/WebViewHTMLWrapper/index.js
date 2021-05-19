const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const wrapper = (html) => (
  `module.exports = ${JSON.stringify(html)};`
);

function createWebView(code) {
  fs.writeFileSync(this.options.dist, wrapper(code));
}

class WebViewHTMLWrapper {
  constructor(props) {
    this.options = props;
  }

  apply(compiler) {
    let webview;
    compiler.hooks.compilation.tap('WebViewHTMLWrapperPlugin', (compilation) => {
      if (HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation)
          .beforeEmit
          .tapAsync(
            'WebViewHTMLWrapperPlugin', (data, callback) => {
              webview = wrapper(data.html);
              callback(null, data);
            }
          );
      }
    });
    compiler.hooks.afterEmit.tapAsync('WebViewHTMLWrapperPlugin', (compilation, callback) => {
      if (webview) {
        createWebView.call(this, webview);
        webview = null;
      }
      callback();
    });
  }
}

module.exports = WebViewHTMLWrapper;
