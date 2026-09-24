import { tester } from '@rockpack/tester';

tester({ serial: true }, { collectCoverage: false, testEnvironment: 'node', testTimeout: 600_000 });
