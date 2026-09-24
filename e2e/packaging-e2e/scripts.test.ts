import { tester } from '@rockpack/tester';

void tester({ serial: true }, { collectCoverage: false, testEnvironment: 'node', testTimeout: 600_000 });
