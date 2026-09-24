import path from 'node:path';
import { fileURLToPath } from 'node:url';

// e2e/tools/src -> repository root
export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

export const starterBin = path.join(repoRoot, 'packages/starter/lib/bin/index.mjs');
