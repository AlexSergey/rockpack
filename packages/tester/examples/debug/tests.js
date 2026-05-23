const tests = require('../../src');
const watch = !!process.argv.find((arg) => arg === 'watch');

tests({ watch });
