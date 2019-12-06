const getPort = require('get-port-sync');
const port = getPort();
const io = require('socket.io')(port);

function ReloadPlugin() {};

ReloadPlugin.prototype.apply = function(compiler) {
    compiler.hooks.compilation.tap('ReloadPlugin', function(compilation) {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('ReloadPlugin', (htmlPluginData, callback) => {
            htmlPluginData.html += `<script src="http://localhost:${port}/socket.io/socket.io.js"></script>`;
            htmlPluginData.html += `<script>var socket = io.connect("http://localhost:${port}");socket.on("reload", function(){window.location.reload()});</script>`
            callback(null, htmlPluginData);
        });
        compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('ReloadPlugin', (htmlPluginData, callback) => {
            io.emit('reload');
            callback(null, htmlPluginData);
        })
    });
};

module.exports = ReloadPlugin;
