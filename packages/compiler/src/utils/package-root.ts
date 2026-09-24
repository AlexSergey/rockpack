import { packageRoot } from '@rockpack/utils';

// The compiler package root, the same for src/utils and lib/<format>/utils.
export const compilerRoot = (): string => packageRoot(import.meta.url);
