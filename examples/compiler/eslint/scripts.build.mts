import { frontendCompiler, getArgs } from '@rockpack/compiler';

const { debug } = getArgs<{ debug?: boolean }>();

void frontendCompiler({
  ...(debug !== undefined ? { debug } : {}),
});
