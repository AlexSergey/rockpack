const { isUndefined, isEmptyObject } = require('valid-types');

const compilers = [
    'frontendCompiler',
    'analyzerCompiler',
    'backendCompiler',
    'libraryCompiler',
    'markupCompiler'
];

function commonMultiValidator(props) {
    if (props.length === 0) {
        console.error('The config is empty');
        return process.exit(1);
    }

    props.forEach(props => {
        if (isUndefined(props.compiler) || isUndefined(props.config) || isEmptyObject(props.config)) {
            console.error('The config is invalid');
            return process.exit(1);
        }
    });

    props.forEach(props => {
        props.compilerName = props.compiler.name;

        if (compilers.indexOf(props.compilerName) < 0) {
            console.error('The config is invalid');
            return process.exit(1);
        }
    });
}

module.exports = commonMultiValidator;
