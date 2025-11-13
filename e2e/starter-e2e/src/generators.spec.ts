import kill from 'kill-port';
import looksSame from 'looks-same';
import { execSync, spawn } from 'node:child_process';
import { join } from 'node:path';
import puppeteer from 'puppeteer';
import { rimraf } from 'rimraf';

import { exists } from './utils/fs';
import { waitForServer } from './utils/wait';

const starter = require.resolve('../../../packages/starter/bin/index.js');

const genFolder = join(__dirname, 'generators');

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

    it(`checks test script for ${type}`, async () => {
      const passedMessage = '✅ All tests have passed successfully!';
      const buf = execSync('npm test', {
        cwd: join(genFolder, `${type}-with-tests`),
      });
      const res = buf
        .toString()
        // eslint-disable-next-line no-control-regex
        .replace(/\x1B\[[0-9;]*m/g, '')
        .split('\n');

      const message = res.find((m) => m === passedMessage);

      expect(message).toBe(passedMessage);
    });
  });

  describe.each(['csr', 'ssr'])('dev server checking', (type) => {
    describe.each([true, false])('dev server checking for project with or without tests', (tests) => {
      it(`${type} dev server checking`, async () => {
        const screenOriginalPth = `screenshots/original/${type}-${tests ? 'with' : 'without'}-tests-dev`;
        const screenNewPth = `screenshots/new/${type}-${tests ? 'with' : 'without'}-tests-dev`;

        const serverProcess = spawn('npm', ['start'], {
          cwd: join(genFolder, `${type}-${tests ? 'with' : 'without'}-tests`),
          detached: true,
        });

        const url = `http://localhost:${type === 'csr' ? '3000' : '4000'}`;

        serverProcess?.stdout?.on('data', (data) => process.stdout.write(`[server] ${data}`));
        serverProcess?.stderr?.on('data', (data) => process.stderr.write(`[server-err] ${data}`));

        await waitForServer(url);
        const browser = await puppeteer.launch({ executablePath: '/opt/homebrew/bin/chromium', headless: 'shell' });

        try {
          const page = await browser.newPage();
          await page.goto(url, { waitUntil: 'networkidle0' });
          await page.screenshot({ path: `${screenNewPth}.png` });
        } catch (err) {
          console.error(err);
        } finally {
          await browser.close();
          serverProcess.kill();

          try {
            await kill(35729);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {}
        }

        const { equal } = await looksSame(`${screenNewPth}.png`, `${screenOriginalPth}.png`, { strict: true });
        expect(equal).toBeTruthy();
      });
    });
  });

  describe('build projects', () => {
    describe('build library', () => {
      describe.each([true, false])('library with or without tests', (tests) => {
        it(`build library ${tests ? 'with' : 'without'} tests`, async () => {
          const projectFolder = `library-${tests ? 'with' : 'without'}-tests`;
          const buf = execSync('npm run build', {
            cwd: join(genFolder, `library-${tests ? 'with' : 'without'}-tests`),
          });
          const res = buf
            .toString()
            // eslint-disable-next-line no-control-regex
            .replace(/\x1B\[[0-9;]*m/g, '')
            .split('\n');
          const message = res[res.length - 2];

          expect(message).toBe('Compiled successfully!');

          const index = await exists(join(genFolder, projectFolder, 'dist', 'index.js'));
          const LICENSE = await exists(join(genFolder, projectFolder, 'dist', 'index.js.LICENSE.txt'));
          const types = await exists(join(genFolder, projectFolder, 'dist', 'types', 'index.d.ts'));

          expect(index).toBeTruthy();
          expect(LICENSE).toBeTruthy();
          expect(types).toBeTruthy();
        });
      });
    });

    describe('build component', () => {
      describe.each([true, false])('component with or without tests', (tests) => {
        it(`build component ${tests ? 'with' : 'without'} tests`, async () => {
          const projectFolder = `component-${tests ? 'with' : 'without'}-tests`;
          const buf = execSync('npm run build', {
            cwd: join(genFolder, `component-${tests ? 'with' : 'without'}-tests`),
          });
          const res = buf
            .toString()
            // eslint-disable-next-line no-control-regex
            .replace(/\x1B\[[0-9;]*m/g, '')
            .split('\n');
          const message = res[res.length - 2];

          expect(message).toBe('Compiled successfully!');

          const index = await exists(join(genFolder, projectFolder, 'dist', 'index.js'));
          const LICENSE = await exists(join(genFolder, projectFolder, 'dist', 'index.js.LICENSE.txt'));
          const types = await exists(join(genFolder, projectFolder, 'dist', 'types', 'index.d.ts'));
          const styles = await exists(join(genFolder, projectFolder, 'dist', 'css', 'styles.css'));

          expect(index).toBeTruthy();
          expect(LICENSE).toBeTruthy();
          expect(types).toBeTruthy();
          expect(styles).toBeTruthy();
        });
      });
    });

    describe('build csr project', () => {
      describe.each([true, false])('csr with or without tests', (tests) => {
        const projectFolder = `csr-${tests ? 'with' : 'without'}-tests`;
        it(`build csr ${tests ? 'with' : 'without'} tests`, async () => {
          const buf = execSync('npm run build', {
            cwd: join(genFolder, `csr-${tests ? 'with' : 'without'}-tests`),
          });
          const res = buf
            .toString()
            // eslint-disable-next-line no-control-regex
            .replace(/\x1B\[[0-9;]*m/g, '')
            .split('\n');
          const message = res[res.length - 2];

          expect(message).toBe('Compiled successfully!');

          const favicon = await exists(join(genFolder, projectFolder, 'dist', 'favicon.ico'));
          const index = await exists(join(genFolder, projectFolder, 'dist', 'index.js'));
          const LICENSE = await exists(join(genFolder, projectFolder, 'dist', 'index.js.LICENSE.txt'));
          const html = await exists(join(genFolder, projectFolder, 'dist', 'index.html'));
          const styles = await exists(join(genFolder, projectFolder, 'dist', 'styles.css'));
          const vendor = await exists(join(genFolder, projectFolder, 'dist', 'vendor.js'));
          const vendorLICENSE = await exists(join(genFolder, projectFolder, 'dist', 'vendor.js.LICENSE.txt'));

          expect(favicon).toBeTruthy();
          expect(index).toBeTruthy();
          expect(LICENSE).toBeTruthy();
          expect(html).toBeTruthy();
          expect(styles).toBeTruthy();
          expect(vendor).toBeTruthy();
          expect(vendorLICENSE).toBeTruthy();
        });

        it('check build stage to csr project', async () => {
          const screenOriginalPth = `screenshots/original/csr-${tests ? 'with' : 'without'}-tests-build`;
          const screenNewPth = `screenshots/new/csr-${tests ? 'with' : 'without'}-tests-build`;

          const serverProcess = spawn('node', ['./src/csr.server.js', tests ? 'with' : 'without'], {
            detached: true,
          });

          const url = 'http://localhost:4000';

          serverProcess?.stdout?.on('data', (data) => process.stdout.write(`[server] ${data}`));
          serverProcess?.stderr?.on('data', (data) => process.stderr.write(`[server-err] ${data}`));

          await waitForServer(url);
          const browser = await puppeteer.launch({ executablePath: '/opt/homebrew/bin/chromium', headless: 'shell' });

          try {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });
            await page.screenshot({ path: `${screenNewPth}.png` });
          } catch (err) {
            console.error(err);
          } finally {
            await browser.close();
            serverProcess.kill();

            try {
              await kill(4000);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {}
            try {
              await kill(35729);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {}
          }

          const { equal } = await looksSame(`${screenNewPth}.png`, `${screenOriginalPth}.png`, { strict: true });
          expect(equal).toBeTruthy();
        });
      });
    });

    describe('build ssr project', () => {
      describe.each([true, false])('ssr with or without tests', (tests) => {
        const projectFolder = `ssr-${tests ? 'with' : 'without'}-tests`;
        it(`build ssr ${tests ? 'with' : 'without'} tests`, async () => {
          const buf = execSync('npm run build', {
            cwd: join(genFolder, `ssr-${tests ? 'with' : 'without'}-tests`),
          });
          const res = buf
            .toString()
            // eslint-disable-next-line no-control-regex
            .replace(/\x1B\[[0-9;]*m/g, '')
            .split('\n');
          const message = res[res.length - 2];

          expect(message).toBe('Compiled successfully!');

          const distCss = await exists(join(genFolder, projectFolder, 'dist', 'css', 'styles.css'));
          const dist0js = await exists(join(genFolder, projectFolder, 'dist', '0.js'));
          const distIndexJS = await exists(join(genFolder, projectFolder, 'dist', 'index.js'));
          const distIndexLicense = await exists(join(genFolder, projectFolder, 'dist', 'index.js.LICENSE.txt'));

          const publicCss = await exists(join(genFolder, projectFolder, 'public', 'css', 'styles.css'));
          const publicFavicon = await exists(join(genFolder, projectFolder, 'public', 'favicon.ico'));
          const publicIndexJS = await exists(join(genFolder, projectFolder, 'public', 'index.js'));
          const publicRobots = await exists(join(genFolder, projectFolder, 'public', 'robots.txt'));

          expect(distCss).toBeTruthy();
          expect(dist0js).toBeTruthy();
          expect(distIndexJS).toBeTruthy();
          expect(distIndexLicense).toBeTruthy();

          expect(publicCss).toBeTruthy();
          expect(publicFavicon).toBeTruthy();
          expect(publicIndexJS).toBeTruthy();
          expect(publicRobots).toBeTruthy();
        });

        it('check build result to ssr project', async () => {
          const screenOriginalPth = `screenshots/original/ssr-${tests ? 'with' : 'without'}-tests-build`;
          const screenNewPth = `screenshots/new/ssr-${tests ? 'with' : 'without'}-tests-build`;

          const serverProcess = spawn('node', ['dist/index.js'], {
            cwd: join(genFolder, projectFolder),
            detached: true,
          });

          const url = 'http://localhost:4000';

          serverProcess?.stdout?.on('data', (data) => process.stdout.write(`[server] ${data}`));
          serverProcess?.stderr?.on('data', (data) => process.stderr.write(`[server-err] ${data}`));

          await waitForServer(url);
          const browser = await puppeteer.launch({ executablePath: '/opt/homebrew/bin/chromium', headless: 'shell' });

          try {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });
            await page.screenshot({ path: `${screenNewPth}.png` });
          } catch (err) {
            console.error(err);
          } finally {
            await browser.close();
            serverProcess.kill();

            try {
              await kill(35729);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {}
          }

          const { equal } = await looksSame(`${screenNewPth}.png`, `${screenOriginalPth}.png`, { strict: true });
          expect(equal).toBeTruthy();
        });
      });
    });
  });
});
