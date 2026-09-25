import type { Browser, Page, StartedProcess } from '@rockpack/e2e-tools';

import { getFreePort, launchBrowser, serveStatic, start, waitForUrl } from '@rockpack/e2e-tools';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { cleanupProjects, latest, npm, prepareProjects } from './projects.js';

type OpenedPage = {
  readonly page: Page;
  // Uncaught exceptions, console errors and failed requests seen by the page.
  readonly problems: string[];
  readonly requests: string[];
};

const PROJECTS = [
  { name: 'csr-app', tests: false, type: 'csr' },
  { name: 'ssr-app', tests: false, type: 'ssr' },
] as const;

const DESCRIPTION = 'Zero-config React with built-in SSR';
// The isomorphic dev server always listens for live reload on this port.

const openPage = async (browser: Browser, url: string): Promise<OpenedPage> => {
  const page = await browser.newPage();
  const problems: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', (error) => problems.push(`pageerror: ${String(error)}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      problems.push(`console: ${message.text()}`);
    }
  });
  page.on('requestfailed', (request) => problems.push(`requestfailed: ${request.url()}`));
  page.on('request', (request) => requests.push(new URL(request.url()).pathname));
  await page.goto(url, { waitUntil: 'networkidle0' });

  return { page, problems, requests };
};

const waitForText = (page: Page, text: string, timeout = 30_000): Promise<unknown> =>
  page.waitForFunction((expected: string) => document.body.textContent.includes(expected), { timeout }, text);

const editFile = (file: string, from: RegExp | string, to: string): void => {
  const source = readFileSync(file, 'utf8');
  if (!(typeof from === 'string' ? source.includes(from) : from.test(source))) {
    throw new Error(`${file} does not contain ${from}`);
  }
  writeFileSync(file, source.replace(from, to));
};

// The ssr server port comes from .env, which the build inlines.
const usePort = async (dir: string): Promise<string> => {
  const port = await getFreePort();
  editFile(path.join(dir, '.env'), /^PORT=.*$/m, `PORT=${port}`);

  return `http://localhost:${port}`;
};

describe(`generated project runtime (${latest ? 'latest' : 'pinned'})`, () => {
  let browser: Browser;
  let outDir: string | undefined;
  const project = (name: string): string => path.join(outDir ?? '', name);

  beforeAll(async () => {
    ({ outDir } = await prepareProjects('runtime', PROJECTS));
    browser = await launchBrowser();
  }, 3_600_000);

  afterAll(async () => {
    await browser.close();
    cleanupProjects(outDir);
  });

  describe('csr', () => {
    describe('production build', () => {
      let opened: OpenedPage;
      let close: () => Promise<void>;

      beforeAll(async () => {
        const { code, output } = await npm(project('csr-app'), ['run', 'build']);
        if (code !== 0) {
          throw new Error(output);
        }
        const server = await serveStatic(path.join(project('csr-app'), 'dist'));
        ({ close } = server);
        opened = await openPage(browser, server.url);
      }, 300_000);

      afterAll(async () => {
        await opened.page.close();
        await close();
      });

      describe('negative cases', () => {
        it('runs without page errors or failed requests', async () => {
          await waitForText(opened.page, DESCRIPTION);

          expect(opened.problems).toEqual([]);
        });

        it('loads no development scripts', () => {
          expect(opened.requests.filter((request) => /hot-update|dev-server|livereload/.test(request))).toEqual([]);
        });
      });

      describe('positive cases', () => {
        it('loads the vendor and the app bundles', () => {
          expect(opened.requests).toEqual(expect.arrayContaining(['/vendor.js', '/index.js', '/styles.css']));
        });

        it('renders the app with its title, data and styles', async () => {
          await waitForText(opened.page, DESCRIPTION);
          const { background, tags, title } = await opened.page.evaluate(() => ({
            background: getComputedStyle(document.querySelector('.bg-slate-950') as Element).backgroundColor,
            tags: document.body.textContent.includes('React 19'),
            title: document.title,
          }));

          expect({ tags, title }).toEqual({ tags: true, title: 'Rockpack' });
          expect(background).not.toBe('rgba(0, 0, 0, 0)');
        });
      });
    });

    describe('development server', () => {
      let server: StartedProcess;
      let opened: OpenedPage;

      beforeAll(async () => {
        server = start('npm', ['start', '--', '--_rockpack_testing'], { cwd: project('csr-app') });
        const [, url = ''] = await server.waitForOutput(/Starting server on (http:\/\/\S+)/, 180_000);
        await waitForUrl(url);
        opened = await openPage(browser, url);
      }, 300_000);

      afterAll(async () => {
        await opened.page.close();
        await server.stop();
      });

      describe('negative cases', () => {
        it('runs without page errors or failed requests', async () => {
          await waitForText(opened.page, DESCRIPTION);

          expect(opened.problems).toEqual([]);
        });
      });

      describe('positive cases', () => {
        it('renders the app', async () => {
          await waitForText(opened.page, DESCRIPTION);

          expect(await opened.page.title()).toBe('Rockpack');
        });

        it('updates the page after a source change', async () => {
          editFile(path.join(project('csr-app'), 'src/components/tags/tags.component.tsx'), "'MIT'", "'MIT e2e'");

          await expect(waitForText(opened.page, 'MIT e2e', 60_000)).resolves.toBeTruthy();
        }, 90_000);
      });
    });
  });

  describe('ssr', () => {
    describe('production build', () => {
      let server: StartedProcess;
      let url: string;
      let html: string;

      beforeAll(async () => {
        url = await usePort(project('ssr-app'));
        const { code, output } = await npm(project('ssr-app'), ['run', 'build']);
        if (code !== 0) {
          throw new Error(output);
        }
        server = start(process.execPath, ['dist/index.js'], { cwd: project('ssr-app') });
        await waitForUrl(url);
        html = await (await fetch(url)).text();
      }, 300_000);

      afterAll(async () => {
        await server.stop();
      });

      describe('negative cases', () => {
        it('serves no development scripts', () => {
          expect(html).not.toMatch(/dev-server|livereload/);
        });

        it('hydrates without page errors or failed requests', async () => {
          const opened = await openPage(browser, url);
          await waitForText(opened.page, DESCRIPTION);

          expect(opened.problems).toEqual([]);
          await opened.page.close();
        });
      });

      describe('positive cases', () => {
        it('renders the markup on the server', () => {
          expect(html).toContain('React 19');
          expect(html).toContain('<title>Rockpack</title>');
        });

        it('serves the client assets', async () => {
          const statuses = await Promise.all(
            ['/index.js', '/css/styles.css', '/favicon.ico', '/robots.txt'].map(
              async (asset) => (await fetch(`${url}${asset}`)).status,
            ),
          );

          expect(statuses).toEqual([200, 200, 200, 200]);
        });

        it('hydrates the server markup in the browser', async () => {
          const opened = await openPage(browser, url);
          await waitForText(opened.page, DESCRIPTION);
          const hydrated = await opened.page.evaluate(() =>
            Object.keys(document.getElementById('root') ?? {}).some((key) => key.startsWith('__reactContainer')),
          );

          expect(hydrated).toBe(true);
          await opened.page.close();
        });
      });
    });

    describe('development server', () => {
      let server: StartedProcess;
      let url: string;

      beforeAll(async () => {
        url = await usePort(project('ssr-app'));
        server = start('npm', ['start'], { cwd: project('ssr-app') });
        await waitForUrl(url, 180_000);
      }, 300_000);

      afterAll(async () => {
        await server.stop();
      });

      describe('negative cases', () => {
        it('runs without page errors or failed requests', async () => {
          const opened = await openPage(browser, url);
          await waitForText(opened.page, DESCRIPTION);

          expect(opened.problems).toEqual([]);
          await opened.page.close();
        });
      });

      describe('positive cases', () => {
        it('renders the markup on the server', async () => {
          expect(await (await fetch(url)).text()).toContain('React 19');
        });

        it('restarts the server after a source change', async () => {
          editFile(path.join(project('ssr-app'), 'src/components/tags/tags.component.tsx'), "'MIT'", "'MIT e2e'");
          let body = '';
          while (!body.includes('MIT e2e')) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            body = (await (await fetch(url).catch(() => undefined))?.text()) ?? '';
          }

          expect(server.output().match(/Server is listening/g)?.length).toBeGreaterThanOrEqual(2);
        }, 120_000);
      });
    });
  });
});
