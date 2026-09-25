import type { OutputStream } from './renderer.js';

import { createRenderer } from './renderer.js';

type FakeStream = OutputStream & { readonly writes: string[] };

const fakeStream = (columns = 80): FakeStream => {
  const writes: string[] = [];

  return { columns, isTTY: true, write: (text): boolean => writes.push(text) > 0, writes };
};

const ESCAPE = '\u001B[';

describe('createRenderer', () => {
  describe('negative cases', () => {
    it('never moves the cursor in plain mode', () => {
      const stream = fakeStream();
      const renderer = createRenderer(stream, false);

      renderer.update(['client  50%']);
      renderer.print(['✔ client  built in 1.0s']);
      renderer.clear();

      expect(stream.writes).toEqual(['✔ client  built in 1.0s\n']);
      expect(stream.writes.join('')).not.toContain(ESCAPE);
    });

    it('writes nothing for an empty print', () => {
      const stream = fakeStream();

      createRenderer(stream, true).print([]);

      expect(stream.writes).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('redraws the live rows in place', () => {
      const stream = fakeStream();
      const renderer = createRenderer(stream, true);

      renderer.update(['client  10%', 'server  20%']);
      stream.writes.length = 0;
      renderer.update(['client  60%', 'server  70%']);

      const output = stream.writes.join('');
      expect(output.startsWith(`${ESCAPE}2A`)).toBe(true);
      expect(output).toContain('client  60%\n');
      expect(output).toContain('server  70%\n');
    });

    it('prints above the live area and draws it again below', () => {
      const stream = fakeStream();
      const renderer = createRenderer(stream, true);
      renderer.update(['client  10%']);
      stream.writes.length = 0;

      renderer.print(['↻ client  src/app.tsx changed']);

      const output = stream.writes.join('');
      expect(output.indexOf('↻ client')).toBeLessThan(output.lastIndexOf('client  10%'));
    });

    it('cuts a row to the terminal width, ignoring colour codes', () => {
      const stream = fakeStream(10);
      const renderer = createRenderer(stream, true);

      renderer.update([`${ESCAPE}32m0123456789abcdef${ESCAPE}39m`]);

      expect(stream.writes.join('')).toContain('012345678…\n');
    });

    it('leaves nothing drawn after clear', () => {
      const stream = fakeStream();
      const renderer = createRenderer(stream, true);
      renderer.update(['client  10%']);

      renderer.clear();
      stream.writes.length = 0;
      renderer.print(['done']);

      expect(stream.writes).toEqual(['done\n']);
    });
  });
});
