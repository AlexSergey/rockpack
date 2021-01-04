const getPort = require('get-port-sync');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = getPort();
const io = require('socket.io')(port);

function ReloadPlugin() {
}

ReloadPlugin.prototype.apply = function reloadPluginApply(compiler) {
  compiler.hooks.compilation.tap('ReloadPlugin', (compilation) => {
    if (HtmlWebpackPlugin.getHooks) {
      HtmlWebpackPlugin.getHooks(compilation)
        .beforeEmit
        .tapAsync(
          'HtmlWebpackInjectorPlugin', (data, callback) => {
            data.html += `<script src="http://localhost:${port}/socket.io/socket.io.js"></script>`;
            data.html += `<script>const socket = io.connect("http://localhost:${port}");socket.on("reload", function(){window.location.reload()});</script>`;
            callback(null, data);
          }
        );

      HtmlWebpackPlugin.getHooks(compilation)
        .afterEmit
        .tapAsync(
          'HtmlWebpackInjectorPlugin', (data, callback) => {
            io.emit('reload');
            callback(null, data);
          }
        );
    }
  });
};

module.exports = ReloadPlugin;
