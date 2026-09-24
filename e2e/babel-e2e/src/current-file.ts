import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const currentFile = (): string => __filename;

export const currentDir = (): string => __dirname;
