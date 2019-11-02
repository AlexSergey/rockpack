const commonMultiValidators = require('../utils/commonMultiValidators');
const multiCompiler = require('./multiCompiler');
const { isDefined, isUndefined, isArray } = require('valid-types');
const errors = require('../errors/isomorphicCompiler');
const makeMode = require('../modules/makeMode');

async function isomorphicCompiler(props = []) {
    commonMultiValidators(props);
    let mode = makeMode();

    let backend = props.find(p => p.compiler.name === 'backendCompiler');

    let frontendCompiler = props.find(p => p.compiler.name === 'frontendCompiler');

    if (!frontendCompiler) {
        console.error(errors.SUPPORT);
        return process.exit(1);
    }

    if (!backend) {
        console.error(errors.BACKEND_IS_REQUIRED);
        return process.exit(1);
    }

    if (Object.keys(props) <= 1) {
        console.error(errors.SHOULD_SET_MORE_THEN_ONE_COMPILERS);
        return process.exit(1);
    }

    props.forEach(prop => {
        ['dist', 'src'].forEach(option => {
            if (isUndefined(prop.config[option])) {
                console.error(errors.SHOULD_SET_OPTION(prop.compiler.name, option));
                return process.exit(1);
            }
        });
    });

    if (isArray(frontendCompiler.config.vendor)) {
        backend.config.__frontendHasVendor = true;
    }

    if (mode === 'development') {
        props.forEach(prop => {
            prop.config.__isIsomorphicStyles = true;
        });
    }
    else {
        backend.config.__isIsomorphicStyles = true;
    }

    props.forEach(prop => {
        prop.config.__isIsomorphicLoader = true;
    });

    frontendCompiler.config.write = isDefined(frontendCompiler.config.write) ? frontendCompiler.config.write : true;
    frontendCompiler.config.html = isDefined(frontendCompiler.config.html) ? frontendCompiler.config.html : false;

    if (mode === 'development') {
        frontendCompiler.config.onlyWatch = isDefined(frontendCompiler.config.onlyWatch) ? frontendCompiler.config.onlyWatch : true;
    }

    return await multiCompiler(props);
}

module.exports = isomorphicCompiler;
