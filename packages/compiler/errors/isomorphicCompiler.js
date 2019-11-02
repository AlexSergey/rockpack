module.exports.BACKEND_IS_REQUIRED = 'backendCompiler is required to set isomorphicCompiler';

module.exports.SUPPORT = 'isomorphicCompiler supported only frontendCompiler';

module.exports.SHOULD_SET_MORE_THEN_ONE_COMPILERS = 'You should set more then 1 compiler. For example: backendCompiler and frontendCompiler';

module.exports.SHOULD_SET_OPTION = (compilerName, option) => `You should set ${option} option to ${compilerName}`;
