import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const moduleFile = (): string => path.basename(fileURLToPath(import.meta.url));
