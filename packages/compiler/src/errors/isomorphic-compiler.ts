export const BACKEND_IS_REQUIRED = 'backendCompiler is required to set isomorphicCompiler';

export const SUPPORT = 'isomorphicCompiler supported only frontendCompiler';

export const SHOULD_SET_MORE_THEN_ONE_COMPILERS =
  'You should set more then 1 compiler. For example: backendCompiler and frontendCompiler';

export const SHOULD_SET_OPTION = (compilerName: string, option: string): string =>
  `You should set ${option} option to ${compilerName}`;
