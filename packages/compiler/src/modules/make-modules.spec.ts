import { createBabelPresets } from '@rockpack/babel';

import { getStylesRules } from '../utils/get-styles-rules.js';
import { makeModules } from './make-modules.js';

jest.mock('@rockpack/babel', () => ({ createBabelPresets: jest.fn((opts: unknown) => ({ presetFor: opts })) }));
jest.mock('../utils/get-styles-rules.js', () => ({
  getStylesRules: jest.fn(() => ({
    css: { module: ['css-module'], simple: ['css-simple'] },
    less: { module: ['less-module'], simple: ['less-simple'] },
    scss: { module: ['scss-module'], simple: ['scss-simple'] },
  })),
}));

const ruleKeys = [
  'css',
  'cssModules',
  'fonts',
  'geojson',
  'graphql',
  'html',
  'images',
  'js',
  'jsx',
  'less',
  'lessModules',
  'markdown',
  'mdx',
  'mjs',
  'node',
  'pdf',
  'scss',
  'scssModules',
  'shaders',
  'svg',
  'svgJSX',
  'ts',
  'tsx',
  'video',
  'wasm',
];

type Rule = Record<string, unknown> & { use?: unknown };

const getRule = (name: string, nodejs = false): Rule =>
  makeModules({ nodejs }, '/project', {}, 'production').dict[name] as Rule;

describe('makeModules', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('drops excluded rules', () => {
      const { dict } = makeModules({}, '/project', {}, 'production', ['graphql', 'mdx']);

      expect(Object.keys(dict)).toEqual(ruleKeys.filter((key) => key !== 'graphql' && key !== 'mdx'));
    });

    it('does not transpile node_modules with babel', () => {
      expect(getRule('js')['exclude']).toEqual(/(node_modules)/);
      expect(getRule('jsx')['exclude']).toEqual(/(node_modules)/);
    });
  });

  describe('positive cases', () => {
    it('defines every rule', () => {
      expect(Object.keys(makeModules({}, '/project', {}, 'production').dict)).toEqual(ruleKeys);
    });

    it('wires the style chains from getStylesRules', () => {
      makeModules({ debug: true }, '/project', {}, 'development');

      expect(getStylesRules).toHaveBeenCalledWith({ debug: true }, 'development', '/project');
      expect(getRule('cssModules').use).toEqual(['css-module']);
      expect(getRule('less').use).toEqual(['less-simple']);
      expect(getRule('scssModules').use).toEqual(['scss-module']);
    });

    it.each([true, false])('forwards nodejs=%s to the babel presets', (nodejs) => {
      getRule('tsx', nodejs);

      expect(createBabelPresets).toHaveBeenCalledWith({ isNodejs: nodejs });
      expect(createBabelPresets).toHaveBeenCalledWith({ isNodejs: nodejs, typescript: true });
      expect(createBabelPresets).toHaveBeenCalledWith({ framework: 'react', isNodejs: nodejs, typescript: true });
    });

    it('loads .wasm files with wasm-loader', () => {
      expect(getRule('wasm')).toEqual({ test: /\.wasm$/, use: expect.stringContaining('wasm-loader') as unknown });
    });

    it('spreads the asset types into asset rules', () => {
      expect(getRule('images')).toMatchObject({ type: 'asset' });
      expect(getRule('video')).toMatchObject({ type: 'asset/resource' });
    });
  });
});
