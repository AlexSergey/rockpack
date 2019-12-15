const path = require('path');
const docgenParse = require('../documentation/docgenParse');
const mergeUrls = require('../documentation/mergeUrls');
const pickUrls = require('../documentation/pickUrls');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

const prerenderDocgen = (plugins, conf, root) => {
    let { sections, languages } = docgenParse(conf);

    if (sections.length > 0) {
        try {
            languages = Array.isArray(languages) && languages.length > 0 ? languages.map(l => ({url: l})) : [{url: ''}];

            let routesToRender = languages.map(l => {
                let cloneSections = JSON.parse(JSON.stringify(sections));
                mergeUrls(cloneSections, l);
                const routes = pickUrls(cloneSections, []);
                return routes;
            }).flat(1);
            if (routesToRender.length > 0) {
                plugins.PrerenderSPAPlugin = new PrerenderSPAPlugin({
                    staticDir: path.resolve(root, conf.dist),
                    routes: routesToRender,
                });
            }
        }
        catch (e) {
            console.error(e);
        }
    }
};

module.exports = prerenderDocgen;
