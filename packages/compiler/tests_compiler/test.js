const path = require('path');
const { run } = require('./core/run');

(async () => {
  try {
    await run({
      cwd: path.join(__dirname, '../examples/', 'react-app'),
      cmd: 'npm run build',
      strategy: 'cra-build'
    });
  } catch (e) {
    console.log(e);
  }
})();
