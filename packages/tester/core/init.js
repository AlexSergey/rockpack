const { runCLI } = require('jest');

const configCompiler = require('../configs/config-compiler');

async function init(opts = {}) {
  const jestConfig = configCompiler(opts);

  try {
    const { results } = await runCLI(jestConfig, [process.cwd()]);

    if (results.success) {
      console.log('✅ All tests have been successfully passed!');
    } else {
      console.error('❌ Some tests have been failed!');
      process.exit(1);
    }
  } catch (err) {
    console.error("Jest can't be run:", err);
    process.exit(1);
  }
}

module.exports = init;
