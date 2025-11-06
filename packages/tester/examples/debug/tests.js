const tests = require('../../index');
const watch = !!(process.argv.find((arg) => arg === 'watch'));

tests({ watch });
