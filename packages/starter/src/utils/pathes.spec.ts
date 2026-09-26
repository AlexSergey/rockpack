import { existsSync } from 'node:fs';
import path from 'node:path';

import type * as PathesModule from './pathes.js';

type Pathes = typeof PathesModule;

const loadPathes = (cwd: string): Pathes => {
  jest.spyOn(process, 'cwd').mockReturnValue(cwd);
  let loaded: Pathes | undefined;
  jest.isolateModules(() => {
    loaded = jest.requireActual<Pathes>('./pathes.js');
  });
  if (!loaded) {
    throw new Error('./pathes was not loaded');
  }

  return loaded;
};

describe('pathes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('keeps the working directory captured at import time', () => {
      const { getCurrentPath } = loadPathes('/work');
      jest.spyOn(process, 'cwd').mockReturnValue('/elsewhere');

      expect(getCurrentPath('app')).toBe(path.join('/work', 'app'));
    });
  });

  describe('positive cases', () => {
    it('resolves "." to the working directory', () => {
      expect(loadPathes('/work').getCurrentPath('.')).toBe('/work');
    });

    it('resolves a project name inside the working directory', () => {
      expect(loadPathes('/work').getCurrentPath('my-app')).toBe(path.join('/work', 'my-app'));
    });

    it('resolves a relative folder from the working directory', () => {
      expect(loadPathes('/work').getCurrentPath(path.join('projects', 'my-app'))).toBe(
        path.join('/work', 'projects', 'my-app'),
      );
    });

    it('keeps an absolute folder as it is', () => {
      const absolute = path.resolve('/srv', 'projects', 'my-app');

      expect(loadPathes('/work').getCurrentPath(absolute)).toBe(absolute);
    });

    it('points the template folders inside the starter templates', () => {
      const { addons, backbone, dummies, root } = loadPathes('/work');

      expect(root).toBe(path.resolve(__dirname, '../..'));
      expect([backbone, addons, dummies]).toEqual([
        path.join(root, 'templates', 'backbone'),
        path.join(root, 'templates', 'addons'),
        path.join(root, 'templates', 'dummies'),
      ]);
      expect([backbone, addons, dummies].every((dir) => existsSync(dir))).toBe(true);
    });
  });
});
