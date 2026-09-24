import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { build, buildFixture, loadPage, prepareFixture, read, waitFor } from './fixtures';

describe('frontendCompiler production builds', () => {
  describe('negative cases', () => {
    it('fails when the entry file does not exist', async () => {
      const dir = prepareFixture('frontend-basic');
      const { code, output } = await build(dir, 'scripts.missing-entry.ts');

      expect(code).toBe(1);
      expect(output).toContain('missing.tsx');
    });

    it('fails when the source does not compile', async () => {
      const dir = prepareFixture('frontend-basic');
      const { code, output } = await build(dir, 'scripts.syntax-error.ts');

      expect(code).toBe(1);
      expect(output).toContain('broken.ts');
    });

    it('fails on an invalid option with its path', async () => {
      const dir = prepareFixture('frontend-basic');
      const { code, output } = await build(dir, 'scripts.invalid-conf.ts');

      expect(code).toBe(1);
      expect(output).toContain('[rockpack] INVALID_CONFIG: html.template must be a string');
    });

    it('fails on a type error with the file in the output', async () => {
      const dir = prepareFixture('frontend-ts');
      writeFileSync(path.join(dir, 'src/invalid.ts'), "export const count: number = 'not a number';\n");
      const { code, output } = await build(dir);

      expect(code).toBe(1);
      expect(output).toContain('invalid.ts');
      expect(output).toContain('TS2322');
    });

    it('fails when a variable from .env.example is missing in .env', async () => {
      const dir = prepareFixture('frontend-dotenv');
      writeFileSync(path.join(dir, '.env'), 'API_URL=https://api.example.test\n');
      const { code, output } = await build(dir);

      expect(code).toBe(1);
      expect(output).toContain('REQUIRED_TOKEN');
    });
  });

  describe('positive cases', () => {
    describe('frontend-basic', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('frontend-basic'));
      });

      it('references the bundle from index.html', () => {
        expect(read(dir, 'dist/index.html')).toMatch(/<script src="\/?index\.js"/);
      });

      it('renders the app when the bundle runs in the page', async () => {
        const dom = loadPage(read(dir, 'dist/index.html'), [read(dir, 'dist/index.js')]);
        const text = await waitFor(() => dom.window.document.querySelector('h1')?.textContent ?? undefined);

        expect(text).toBe('Hello from Rockpack');
        dom.window.close();
      });

      it('emits a hidden source map in production', () => {
        expect(existsSync(path.join(dir, 'dist/index.js.map'))).toBe(true);
        expect(read(dir, 'dist/index.js')).not.toContain('sourceMappingURL');
      });
    });

    describe('frontend-full', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('frontend-full'));
      });

      it('extracts the styles into the configured file', () => {
        expect(read(dir, 'dist/styles.css')).toContain('.title{color:#010203}');
      });

      it('moves the vendor modules out of the main bundle', () => {
        expect(read(dir, 'dist/vendor.js')).toContain('react.transitional.element');
        expect(read(dir, 'dist/index.js')).not.toContain('react.transitional.element');
      });

      it('puts the package banner at the top of the bundle', () => {
        expect(read(dir, 'dist/index.js').slice(0, 300)).toContain('frontend-full: 2.0.0');
      });

      it('copies the favicon and the configured files', () => {
        expect(existsSync(path.join(dir, 'dist/favicon.ico'))).toBe(true);
        expect(read(dir, 'dist/robots.txt')).toBe('User-agent: *\n');
      });

      it('renders the custom template with the code snippet and the version', () => {
        const html = read(dir, 'dist/index.html');

        expect(html).toContain('<script>window.FIXTURE_CODE = true;</script>');
        expect(html).toContain('<meta name="version" content="2.3.4">');
        expect(html).toContain(
          '<link href="/styles.css" rel="stylesheet"><script src="/vendor.js" defer="defer"></script><script src="/index.js"',
        );
      });

      it('inlines the global values into the running app', async () => {
        const dom = loadPage(read(dir, 'dist/index.html'), [read(dir, 'dist/vendor.js'), read(dir, 'dist/index.js')]);
        const text = await waitFor(() => dom.window.document.querySelector('.title')?.textContent ?? undefined);

        expect(text).toBe('full-fixture');
        expect(read(dir, 'dist/index.js')).not.toContain('APP_NAME');
        dom.window.close();
      });
    });

    describe('frontend-dotenv', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('frontend-dotenv'));
      });

      it('inlines the variables from .env and .env.defaults', () => {
        const dom = loadPage(read(dir, 'dist/index.html'), [read(dir, 'dist/index.js')]);

        expect(dom.window.document.title).toBe('https://api.example.test|token-from-env|30');
        dom.window.close();
      });

      it('does not leak the variables the code does not use', () => {
        expect(read(dir, 'dist/index.js')).not.toContain('must-not-leak');
      });
    });

    describe('frontend-ts', () => {
      it('builds TypeScript with decorators', async () => {
        const { dir } = await buildFixture('frontend-ts');
        const dom = loadPage(read(dir, 'dist/index.html'), [read(dir, 'dist/index.js')]);

        expect(dom.window.document.title).toBe('widget:decorated');
        dom.window.close();
      });
    });

    describe('frontend-analyzer', () => {
      it('emits the static bundle report', async () => {
        const { dir } = await buildFixture('frontend-analyzer');

        expect(readdirSync(path.join(dir, 'dist'))).toContain('webpack-report.html');
      });
    });
  });
});
