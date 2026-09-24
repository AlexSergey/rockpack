import { tester } from '@rockpack/tester';

// Fixtures are built into a shared .out folder by child processes, so the suites run one at a time.
void tester({ serial: true }, { collectCoverage: false, testEnvironment: 'node', testTimeout: 300_000 });
