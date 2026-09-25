import { tester } from '@rockpack/tester';

// The specs run as ES modules: import.meta and top-level await work, `jest` comes from '@jest/globals'.
void tester({ esm: true });
