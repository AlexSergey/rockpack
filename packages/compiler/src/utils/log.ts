import type { MultiStats, Stats } from 'webpack';

import moment from 'moment';
import formatMessages from 'webpack-format-messages';

export const log = (compilation: MultiStats | null | Stats | undefined): void => {
  const stats = compilation && 'stats' in compilation ? compilation.stats : compilation ? [compilation] : [];

  for (const s of stats) {
    const messages = formatMessages(s);
    const duration = moment.duration(s.endTime - s.startTime, 'milliseconds');
    console.log('[COMPILE]', `${duration.minutes()}:${duration.seconds()} minutes`);

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
