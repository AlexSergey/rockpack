const { tester } = require('@rockpack/tester');

const watch = !!process.argv.find((arg) => arg === 'watch');

tester({ watch });
