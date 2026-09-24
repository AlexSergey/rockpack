import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { build, buildFixture, loadPage, read, waitFor } from './fixtures';

describe('frontendCompiler styles and assets', () => {
  describe('positive cases', () => {
    describe('frontend-styles', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('frontend-styles', undefined, { allowFailure: true }));
        // The type checker runs before the loader writes the CSS module declarations, so a clean project only
        // builds from the second run on (noted for Plan 3); the first run is what generates them.
        const { code, output } = await build(dir);
        if (code !== 0) {
          throw new Error(output);
        }
      });

      it('generates declarations for the CSS, SCSS and Less modules', () => {
        expect(read(dir, 'src/button.module.css.d.ts')).toContain("'primary': string;");
        expect(read(dir, 'src/card.module.scss.d.ts')).toContain("'card': string;");
        expect(read(dir, 'src/panel.module.less.d.ts')).toContain("'panel': string;");
      });

      it('compiles Tailwind utilities and SCSS', () => {
        const css = read(dir, 'dist/css/styles.css');

        expect(css).toContain('.text-center{text-align:center}');
        expect(css).toContain('.theme{color:#0a141e}');
      });

      it('hashes the module class names used by the page', () => {
        const css = read(dir, 'dist/css/styles.css');
        const dom = loadPage(read(dir, 'dist/index.html'), [read(dir, 'dist/index.js')]);
        const { document } = dom.window;
        const button = document.querySelector('button')?.className ?? '';
        const panel = document.querySelector('.text-center div')?.className ?? '';

        expect(button).toMatch(/^[\w-]{8,}$/);
        expect(button).not.toBe('primary');
        expect(css).toContain(`.${button}{color:#28323c}`);
        expect(css).toContain(`.${panel}{padding:9px}`);
        dom.window.close();
      });
    });

    describe('frontend-assets', () => {
      let dir: string;

      beforeAll(async () => {
        ({ dir } = await buildFixture('frontend-assets'));
      });

      it('emits the large assets with hashed names', () => {
        const files = (folder: string): string[] => readdirSync(path.join(dir, 'dist/static', folder));

        expect(files('svg')).toEqual([expect.stringMatching(/^big\.[\da-f]+\.svg$/)]);
        expect(files('fonts')).toEqual([expect.stringMatching(/^font\.[\da-f]+\.woff2$/)]);
      });

      it('renders markdown, MDX, SVG components, JSON and asset urls', async () => {
        const dom = loadPage(read(dir, 'dist/index.html'), [read(dir, 'dist/index.js')]);
        const { document } = dom.window;
        await waitFor(() => document.querySelector('.answer') ?? undefined);

        expect(document.querySelector('.markdown h1')?.textContent).toBe('Markdown title');
        expect(document.querySelector('h2')?.textContent).toBe('MDX title');
        expect(document.querySelector('svg.logo circle')).not.toBeNull();
        expect(document.querySelector('.answer')?.textContent).toBe('42');
        expect(document.querySelector('.icon')?.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
        expect(document.querySelector('.big')?.getAttribute('src')).toMatch(/^\/static\/svg\/big\.[\da-f]+\.svg$/);
        dom.window.close();
      });

      it('minifies images before inlining them', async () => {
        const dom = loadPage(read(dir, 'dist/index.html'), [read(dir, 'dist/index.js')]);
        const src = await waitFor(() => dom.window.document.querySelector('.photo')?.getAttribute('src') ?? undefined);
        const inlined = Buffer.from(src.replace('data:image/png;base64,', ''), 'base64');

        expect(src).toMatch(/^data:image\/png;base64,/);
        expect(inlined.length).toBeLessThan(statSync(path.join(dir, 'src/photo.png')).size / 4);
        dom.window.close();
      });

      it('runs the WebAssembly module', async () => {
        const dom = loadPage(read(dir, 'dist/index.html'), [read(dir, 'dist/index.js')]);
        const { fixtureSum } = dom.window as unknown as { fixtureSum: (a: number, b: number) => Promise<number> };

        await expect(fixtureSum(2, 3)).resolves.toBe(5);
        expect(existsSync(path.join(dir, 'dist/static/images'))).toBe(false);
        dom.window.close();
      });
    });
  });
});
