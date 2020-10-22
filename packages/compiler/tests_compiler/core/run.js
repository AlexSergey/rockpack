const child = require('child_process');
const WebpackObserver = require('./WebpackObserver');

const run = ({
  cmd,
  cwd,
  strategy
}) => {
  const strategies = {
    'run-dev-server': (data) => {
      const s = data.match(/I {2}Starting server on/g);
      if (!s) {
        return false;
      }
      return Array.isArray(s) && s.length > 0;
    },
    'cra-build': (data) => {
      const s = data.indexOf('Compiled successfully!');

      return s > 0;
    }
  };

  return new Promise((resolve, reject) => {
    const observer = new WebpackObserver({
      onError: reject,
      onFinished: resolve,
      end: 2 * 60 * 1000
    }).run(300);

    const r = child.exec(`${cmd} -- --_rockpack_testing`, {
      stdio: 'ignore',
      cwd,
    });

    r.stdout.on('data', (data) => {
      const state = strategies[strategy](data);
      if (state) {
        observer.setState('done');
      }
    });

    r.on('exit', code => {
      if (code !== 0) {
        observer.setState('error');
      }
    });
  });
};

module.exports = { run };
