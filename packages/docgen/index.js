const path = require('path');
const { libraryCompiler } = require('../compiler');
const apidoc = require('apidoc');

async function docgen(options) {
    const root = path.dirname(require.main.filename);
    const documentation = options.documentation;
    const dist = options.dist;

    const backend = documentation.backend.map(item => {
        return {
            src: path.resolve(root, item.src),
            dist: path.resolve(root, dist, item.name),
            config: path.resolve(root, item.config)
        }
    });
    const client = documentation.client.map(item => {
        return {
            src: path.resolve(root, item.src),
            dist: path.resolve(root, dist, item.name),
            name: item.name
        }
    });
    try {
        for (let i = 0, l = backend.length; i < l; i++) {
            let service = backend[i];
            await apidoc.createDoc({
                dest: service.dist,
                src: service.src,
                config: service.config
            });
        }
        for (let i = 0, l = client.length; i < l; i++) {
            let app = client[i];
            let name = app.name;
            console.log(app, name);
            delete app.name;
            await libraryCompiler(name, app);
        }
    }
    catch (e) {
        console.log(e);
    }
    /*backendCompiler({
        dist: path.resolve(root, options.dist),
        src: backend,
    }, (config, modules, plugins) => {
        plugins.Apidoc = new Apidoc({
            src: backend,
            dest: "build/",
            template: "template/",
            debug: true
        });
    });*/
}

module.exports = docgen;
