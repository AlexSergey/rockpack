import { basename } from 'node:path';

// eslint-disable-next-line @import-lite/no-default-export
export default {
  process(_src: string, filename: string): { code: string } {
    return { code: `module.exports = ${JSON.stringify(basename(filename))};` };
  },
};
