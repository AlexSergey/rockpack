const { frontendCompiler } = require('@rockpack/compiler');
const prerenderDocgen = require('./postrender');

frontendCompiler({
  inline: false
}, (finalConfig, modules, plugins) => {
  if (process.env.NODE_ENV === 'production') {
    prerenderDocgen(plugins, finalConfig);
  }
});
