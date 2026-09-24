import { buildPackage } from '@rockpack/build-tools';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

buildPackage({ formats: ['esm'], root });
