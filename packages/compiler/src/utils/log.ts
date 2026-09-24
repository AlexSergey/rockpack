import type { MultiStats, Stats } from 'webpack';

import formatMessages from 'webpack-format-messages';

const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);

  return `${Math.floor(totalSeconds / 60)}:${totalSeconds % 60} minutes`;
};

export const log = (compilation: MultiStats | null | Stats | undefined): void => {
  const stats = compilation && 'stats' in compilation ? compilation.stats : compilation ? [compilation] : [];

  for (const s of stats) {
    const messages = formatMessages(s);
    console.log('[COMPILE]', formatDuration(s.endTime - s.startTime));

    if (!messages.errors.length) {
      console.log('Compiled successfully!');
    }

    if (messages.errors.length) {
      console.log('Failed to compile.');
      for (const e of messages.errors) {
        console.log(e);
      }
    }
  }
};
