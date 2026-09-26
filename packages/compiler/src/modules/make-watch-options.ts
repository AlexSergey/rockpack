import path from 'node:path';

export type WatchOptions = {
  readonly ignored: readonly string[];
};

const contains = (dir: string, file: string): boolean => {
  const relative = path.relative(dir, file);

  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

// What a watching build writes itself: the bundles and the caches (tsc build info, webpack). Watching them made
// every emit trigger another rebuild. An output folder that holds a source is still watched. Watchpack matches
// the paths with forward slashes, a folder together with everything in it.
export const makeWatchOptions = (
  root: string,
  outputs: readonly string[],
  sources: readonly string[],
): WatchOptions => {
  const written = outputs.filter((output) => !sources.some((source) => contains(output, source)));
  const folders = [...new Set([...written, path.join(root, 'node_modules', '.cache')])];

  return { ignored: folders.map((folder) => folder.split(path.sep).join('/')) };
};
