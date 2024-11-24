const path = require('node:path');

const { run } = require('./core/run');

(async () => {
  try {
    await run({
      cmd: 'npm run build',
      cwd: path.join(__dirname, '../examples/', 'react-app'),
      strategy: 'cra-build',
    });
  } catch (e) {
    console.log(e);
  }
})();
