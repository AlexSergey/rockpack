import { cleanPackage } from '@rockpack/build-tools';
import path from 'node:path';

cleanPackage(path.resolve(import.meta.dirname, '..'));
