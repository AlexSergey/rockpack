const { runCLI } = require('jest');

const configCompiler = require('../configs/config-compiler');

async function init(opts = {}) {
  const jestConfig = configCompiler(opts);

  try {
    const { results } = await runCLI(jestConfig, [process.cwd()]);

    if (results.success) {
      console.log('✅ All tests have passed successfully!');
    } else {
      console.error('❌ Some tests have failed!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Jest encountered an error:', err);
    process.exit(1);
  }
}

module.exports = init;
