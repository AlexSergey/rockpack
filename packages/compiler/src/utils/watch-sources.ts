import { watch } from 'node:fs';

// Calls onChange once per burst of file changes under the folders (a save often writes several events).
// Returns a function that stops watching.
export const watchSources = (dirs: readonly string[], onChange: () => void, debounceMs = 100): (() => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = (): void => {
    clearTimeout(timer);
    timer = setTimeout(onChange, debounceMs);
  };
  const watchers = [...new Set(dirs)].map((dir) => watch(dir, { recursive: true }, schedule));

  return (): void => {
    clearTimeout(timer);
    watchers.forEach((watcher) => {
      watcher.close();
    });
  };
};
