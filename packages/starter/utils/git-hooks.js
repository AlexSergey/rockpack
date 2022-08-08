const { spawnSync } = require('child_process');

const { getPM } = require('./other');

module.exports = async ({
  tester,
  codestyle,
}) => {
  let hooksCommon = [];
  let hooksCommit = [];
  let hooksPush = [];

  if (codestyle) {
    hooksCommon.push(`${getPM()} run lint`);
  }

  hooksCommit = hooksCommit.concat(hooksCommon);

  if (tester) {
    hooksPush = hooksPush.concat(hooksCommon);
    hooksPush.push(`${getPM()} test`);
  }

  hooksPush.push(`${getPM()} run build`);

  hooksCommit = hooksCommit.join(' && ');
  hooksPush = hooksPush.join(' && ');

  spawnSync('npm', ['set-script', 'prepare', '"husky install"'], {
    shell: true
  });

  spawnSync('npm', ['run', 'prepare'], {
    shell: true
  });

  if (hooksCommit.length > 0) {
    spawnSync('npx', ['husky', 'add', '.husky/pre-commit', `"${hooksCommit}"`], {
      shell: true
    });

    spawnSync('git', ['add', '.husky/pre-commit'], {
      shell: true
    });
  }

  if (hooksPush.length > 0) {
    spawnSync('npx', ['husky', 'add', '.husky/pre-push', `"${hooksPush}"`], {
      shell: true
    });

    spawnSync('git', ['add', '.husky/pre-push'], {
      shell: true
    });
  }

  if (codestyle) {
    spawnSync('npx', ['husky', 'add', '.husky/commit-msg', '"npm run lint:commit"'], {
      shell: true
    });

    spawnSync('git', ['add', '.husky/commit-msg'], {
      shell: true
    });
  }
}
