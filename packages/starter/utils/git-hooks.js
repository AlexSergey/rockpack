const { spawnSync } = require('child_process');

const { getPM } = require('./other');

module.exports = async ({
  tester,
  codestyle,
}) => {
  let hooksCommon = [];
  let hooksCommit = [];
  let hooksPush = [];

  hooksPush = hooksPush.concat(hooksCommon);
  hooksCommit = hooksCommit.concat(hooksCommon);

  if (codestyle) {
    hooksCommit.push(`${getPM()} run pre-commit`);
  }

  if (tester) {
    hooksPush.push(`${getPM()} test`);
  }

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
