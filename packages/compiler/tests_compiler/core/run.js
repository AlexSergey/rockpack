const child = require('node:child_process');

const WebpackObserver = require('./webpack-observer');

const run = ({ cmd, cwd, strategy }) => {
  const strategies = {
    'cra-build': (data) => {
      const s = data.indexOf('Compiled successfully!');

      return s > 0;
    },
    'run-dev-server': (data) => {
      const s = data.match(/I {2}Starting server on/g);
      if (!s) {
        return false;
      }

      return Array.isArray(s) && s.length > 0;
    },
  };

  return new Promise((resolve, reject) => {
    const observer = new WebpackObserver({
      end: 2 * 60 * 1000,
      onError: reject,
      onFinished: resolve,
    }).run(300);

    const r = child.exec(`${cmd} -- --_rockpack_testing`, {
      cwd,
      stdio: 'ignore',
    });

    r.stdout.on('data', (data) => {
      const state = strategies[strategy](data);
      if (state) {
        observer.setState('done');
      }
    });

    r.on('exit', (code) => {
      if (code !== 0) {
        observer.setState('error');
      }
    });
  });
};

module.exports = { run };
