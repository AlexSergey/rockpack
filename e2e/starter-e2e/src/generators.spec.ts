import { execSync } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { rimraf } from 'rimraf';
const starter = require.resolve('../../../packages/starter/bin/index.js');

const genFolder = join(__dirname, 'generators');

async function exists(f: string): Promise<boolean> {
  try {
    await stat(f);

    return true;
  } catch {
    return false;
  }
}

describe('Generators tests', () => {
  beforeAll(async () => {
    await rimraf(`${genFolder}/*`, { glob: { dot: true } });
  });
  describe.each(['csr', 'ssr', 'component', 'library'])('generate project with types', (type) => {
    describe.each([true, false])('generate project with tests or without tests', (tests) => {
      const projectFolder = tests ? `${type}-with-tests` : `${type}-without-tests`;

      it(`generates project with type %i ${tests ? ' with test' : ' without test'}`, () => {
        const buf = execSync(
          `node ${starter} --no-install --folder="generators" --type="${type}" --tests=${tests} ${projectFolder}`,
          {
            cwd: __dirname,
          },
        );
        const res = buf
          .toString()
          // eslint-disable-next-line no-control-regex
          .replace(/\x1B\[[0-9;]*m/g, '')
          .split('\n');
        const message = res[res.length - 2];
        expect(message).toBe(`Project "${projectFolder}" was created successfully!`);
      });

      describe('tests generated project', () => {
        it('exists package.json', async () => {
          const pkg = await exists(join(genFolder, projectFolder, 'package.json'));
          expect(pkg).toBeTruthy();
        });

        it('exists lint files', async () => {
          const commitlintrc = await exists(join(genFolder, projectFolder, '.commitlintrc.js'));
          const eslint = await exists(join(genFolder, projectFolder, 'eslint.config.js'));
          const stylelintrc = await exists(join(genFolder, projectFolder, '.stylelintrc.js'));
          expect(commitlintrc).toBeTruthy();
          expect(eslint).toBeTruthy();
          expect(stylelintrc).toBeTruthy();
        });

        it(`checks if ${tests ? ' the project has tests files' : ' the project has not tests files'}`, async () => {
          const scriptsTests = await exists(join(genFolder, projectFolder, 'scripts.tests.js'));

          if (tests) {
            expect(scriptsTests).toBeTruthy();
          } else {
            expect(scriptsTests).toBeFalsy();
          }
        });
      });

      describe('tests scripts', () => {
        it('runs npm lint', async () => {
          let errors = false;
          try {
            execSync('npm run lint', {
              cwd: join(genFolder, projectFolder),
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            errors = true;
            if (e && Array.isArray(e.output)) {
              e.output.forEach((_e: Buffer) => {
                if (_e && typeof _e.toString === 'function') {
                  throw new Error(_e.toString());
                }
              });
            }
          }
          expect(errors).toBeFalsy();
        });
      });
    });
  });
});
