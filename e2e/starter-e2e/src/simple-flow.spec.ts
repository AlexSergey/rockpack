import { execSync } from 'child_process';

import { version } from '../../../package.json';
const starter = require.resolve('../../../packages/starter/bin/index.js');

describe('Starter simple flow', () => {
  it('Check Rockpack version - rockpack -v', () => {
    const a = execSync(`node ${starter} -v`);
    const res = a.toString().replace('\n', '');
    // eslint-disable-next-line no-control-regex
    const clean = res.replace(/\x1B\[[0-9;]*m/g, '');
    expect(clean).toEqual(`Rockpack v${version}`);
  });

  it('Check Rockpack help - rockpack -h', () => {
    const a = execSync(`node ${starter} -h`);
    const res = a
      .toString()
      .replaceAll('\n', '')
      .replace(/\s{2,}/g, ' ');
    // eslint-disable-next-line no-control-regex
    const clean = res.replace(/\x1B\[[0-9;]*m/g, '');
    expect(clean).toEqual(
      'USAGE rockpack projARGUMENTS <project-name> Project nameGLOBAL OPTIONS -h (--help) Display this help message -v (--version) Display this application version',
    );
  });

  it('Check no name warning', () => {
    try {
      execSync(`node ${starter}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message.indexOf('Please specify the project directory') > 0).toBeTruthy();
    }
  });
});
