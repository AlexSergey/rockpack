const PrerenderSPAPlugin = require('prerender-spa-plugin');
const docgenParse = require('./docgenParse');
const mergeUrls = require('./mergeUrls');
const pickUrls = require('./pickUrls');

const prerenderDocgen = (plugins, finalConfig) => {
  const { sections } = docgenParse(finalConfig.entry.index, finalConfig.resolve.extensions);
  let { languages } = docgenParse(finalConfig.entry.index, finalConfig.resolve.extensions);

  if (sections.length > 0) {
    try {
      languages = Array.isArray(languages) && languages.length > 0 ? languages.map(l => ({ url: l })) : [{ url: '' }];

      const routesToRender = languages.map(l => {
        const cloneSections = JSON.parse(JSON.stringify(sections));
        mergeUrls(cloneSections, l);
        return pickUrls(cloneSections, []);
      }).flat(1);

      if (routesToRender.length > 0) {
        plugins.set('PrerenderSPAPlugin', new PrerenderSPAPlugin({
          staticDir: finalConfig.output.path,
          routes: routesToRender,
        }));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
};

module.exports = prerenderDocgen;
