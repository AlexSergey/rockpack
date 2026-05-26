import { tester } from '@rockpack/tester';

const watch = !!process.argv.find((arg) => arg === 'watch');

tester({ watch });
