import type { InternalCompilerConf } from '../types.js';

import { RockpackError } from '../errors/rockpack-error.js';
import { assertValidConf, validateConf } from './validate-conf.js';

const valid: Partial<InternalCompilerConf> = { dist: 'dist/index.js', src: 'src/index.ts' };

const messages = (conf: Record<string, unknown>): string[] =>
  validateConf({ ...valid, ...conf }).map((problem) => problem.message);

describe('validateConf', () => {
  describe('negative cases', () => {
    it('reports a missing or non-string src as an invalid entry', () => {
      const [problem] = validateConf({ dist: 'dist/index.js', src: 42 as unknown as string });

      expect(problem).toMatchObject({ code: 'INVALID_ENTRY', message: 'src must be a string' });
    });

    it('names the path of a wrong option inside html pages', () => {
      expect(messages({ html: [{ template: 'a.ejs' }, { template: 1 }] })).toEqual([
        'html[1].template must be a string',
      ]);
      expect(messages({ html: { favicon: 1 } })).toEqual(['html.favicon must be a string or null']);
    });

    it('checks every copy form', () => {
      expect(messages({ copy: { from: 'a' } })).toEqual(['copy.to must be a string']);
      expect(messages({ copy: [{ from: 'a', to: 'b' }, { from: 'c' }] })).toEqual(['copy[1].to must be a string']);
      expect(messages({ copy: { files: [{ from: 1, to: 'b' }] } })).toEqual(['copy.files[0].from must be a string']);
    });

    it('checks scalar, list and format options', () => {
      expect(
        messages({
          banner: 1,
          esm: { dist: 'lib/esm' },
          global: { API: 1 },
          ignore: ['a', 2],
          port: -1,
          styles: true,
          vendor: ['react', 1],
        }),
      ).toEqual([
        'banner must be a boolean or a string',
        'esm.src must be a string',
        'global.API must be a string',
        'ignore[1] must be a string',
        'port must be a positive integer',
        'styles must be false or a string',
        'vendor[1] must be a string',
      ]);
    });

    it.each([true, false])('reports the removed analyzer option (%p) with the migration hint', (analyzer) => {
      expect(messages({ analyzer })).toEqual([
        'analyzer was removed in 9.0.0: add the analyzer plugin in the compiler callback (see MIGRATION.md)',
      ]);
    });

    it('reports a wrong type at the container level', () => {
      expect(messages({ global: 'x', html: 'page', vendor: 'react' })).toEqual([
        'global must be an object',
        'html must be an object',
        'vendor must be an array',
      ]);
    });

    it('throws a single problem as it is', () => {
      expect(() => {
        assertValidConf({ ...valid, src: 1 } as unknown as Partial<InternalCompilerConf>);
      }).toThrow(new RockpackError('INVALID_ENTRY', 'src must be a string'));
    });

    it('throws every problem at once with the code of the first', () => {
      expect(() => {
        assertValidConf({ ...valid, debug: 'no', port: 0 } as unknown as Partial<InternalCompilerConf>);
      }).toThrow(new RockpackError('INVALID_CONFIG', 'debug must be a boolean; port must be a positive integer'));
    });
  });

  describe('positive cases', () => {
    it('accepts the documented forms of every option', () => {
      expect(
        messages({
          banner: 'text',
          cjs: { dist: 'lib/cjs', src: 'src' },
          copy: { files: [{ from: 'a', to: 'b' }], opts: {} },
          debug: false,
          global: { API: 'x' },
          html: [{ code: null, favicon: 'f.ico', filename: false, template: 't.ejs', title: 'T' }],
          port: 3000,
          styles: false,
          types: 'types',
          vendor: ['react'],
          version: '1.0.0',
        }),
      ).toEqual([]);
      expect(messages({ copy: [{ from: 'a', to: 'b' }], html: true, styles: 'style.css' })).toEqual([]);
    });

    it('passes a valid conf through assertValidConf', () => {
      expect(() => {
        assertValidConf(valid);
      }).not.toThrow();
    });
  });
});
