const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const docgenParse = require('./docgenParse');
const mergeUrls = require('./mergeUrls');
const pickUrls = require('./pickUrls');

const prerenderDocgen = (plugins, conf, root) => {
  const { sections } = docgenParse(conf);
  let { languages } = docgenParse(conf);

  if (sections.length > 0) {
    try {
      languages = Array.isArray(languages) && languages.length > 0 ? languages.map(l => ({ url: l })) : [{ url: '' }];

      const routesToRender = languages.map(l => {
        const cloneSections = JSON.parse(JSON.stringify(sections));
        mergeUrls(cloneSections, l);
        return pickUrls(cloneSections, []);
      }).flat(1);
      if (routesToRender.length > 0) {
        plugins.PrerenderSPAPlugin = new PrerenderSPAPlugin({
          staticDir: path.resolve(root, conf.dist),
          routes: routesToRender,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = prerenderDocgen;
