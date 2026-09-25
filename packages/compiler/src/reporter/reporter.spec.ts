import type { Problem } from './format-errors.js';
import type { OutputStream } from './renderer.js';

import { createReporter } from './reporter.js';

type FakeStream = OutputStream & { readonly writes: string[] };

const fakeStream = (isTTY: boolean): FakeStream => {
  const writes: string[] = [];

  return { columns: 120, isTTY, write: (text): boolean => writes.push(text) > 0, writes };
};

const output = (stream: FakeStream): string => stream.writes.join('');

const tsError: Problem = {
  kind: 'TypeScript',
  location: 'src/app.tsx:12:5',
  message: "TS2339: Property 'title' does not exist.",
};
const sizeWarning: Problem = { kind: 'Build', message: 'asset size limit: index.js (400 KiB)' };

const plain = (
  options: { debug?: boolean } = {},
): { reporter: ReturnType<typeof createReporter>; stream: FakeStream } => {
  const stream = fakeStream(false);

  return { reporter: createReporter({ ...options, env: {}, stream }), stream };
};

describe('createReporter', () => {
  describe('negative cases', () => {
    it('draws no bars and no escape codes without a TTY, in CI or with progress off', () => {
      const tty = fakeStream(true);
      const reporters = [
        plain().reporter,
        createReporter({ env: { CI: 'true' }, stream: tty }),
        createReporter({ env: {}, progress: false, stream: tty }),
      ];

      expect(reporters.map((reporter) => reporter.interactive)).toEqual([false, false, false]);
    });

    it('lists the errors and only counts the warnings of a failed build', () => {
      const { reporter, stream } = plain();
      reporter.start('client');

      reporter.done('client', { durationMs: 900, errors: [tsError, tsError], warnings: [sizeWarning] });

      expect(output(stream)).toBe(
        [
          ' ● client  building',
          ' ✖ client  1 error',
          '',
          "   TypeScript  src/app.tsx:12:5  TS2339: Property 'title' does not exist.",
          '',
        ].join('\n'),
      );
    });

    it('only counts the warnings a rebuild repeats', () => {
      const { reporter, stream } = plain();
      reporter.done('server', { durationMs: 100, errors: [], warnings: [sizeWarning] });
      reporter.done('server', { durationMs: 100, errors: [], warnings: [sizeWarning] });

      expect(output(stream).match(/asset size limit/g)).toHaveLength(1);
      expect(output(stream).match(/1 warning/g)).toHaveLength(2);
    });

    it('keeps the info lines until the first successful build', () => {
      const { reporter, stream } = plain();
      reporter.info('server', 'nodemon is running');

      reporter.done('server', { durationMs: 1, errors: [tsError], warnings: [] });

      expect(output(stream)).not.toContain('nodemon is running');
    });

    it('prints nothing for an empty list of late problems', () => {
      const { reporter, stream } = plain();

      reporter.issues('client', []);

      expect(stream.writes).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('prints one summary line per build with the output size and the info lines once', () => {
      const { reporter, stream } = plain();
      reporter.info('client', 'Starting server on http://localhost:3000');
      reporter.start('client');
      reporter.done('client', {
        durationMs: 2400,
        errors: [],
        output: { bytes: 1_300_000, dir: 'dist' },
        warnings: [],
      });
      reporter.start('client', ['src/app.tsx']);
      reporter.done('client', { durationMs: 300, errors: [], warnings: [] });

      expect(output(stream)).toBe(
        [
          ' ● client  building',
          ' ✔ client  built in 2.4s, dist  1.2 MB',
          '   › Starting server on http://localhost:3000',
          ' ↻ client  src/app.tsx changed',
          ' ✔ client  built in 0.3s',
          '',
        ].join('\n'),
      );
    });

    it('lists the warnings of a successful build and of any build in debug mode', () => {
      const { reporter, stream } = plain({ debug: true });
      reporter.done('client', { durationMs: 1000, errors: [tsError], warnings: [sizeWarning] });

      expect(output(stream)).toContain('   Build  asset size limit: index.js (400 KiB)');
    });

    it('prints an info line at once after the first successful build', () => {
      const { reporter, stream } = plain();
      reporter.done('server', { durationMs: 1000, errors: [], warnings: [] });

      reporter.info('server', 'node-inspect is available on 9229 port');

      expect(output(stream)).toContain('   › node-inspect is available on 9229 port\n');
    });

    it('reports late TypeScript problems as their own block', () => {
      const { reporter, stream } = plain();

      reporter.issues('client', [tsError]);

      expect(output(stream)).toContain(' ✖ client  1 TypeScript error\n');
    });

    it('draws a row per building compiler in a terminal, throttled', () => {
      const stream = fakeStream(true);
      let time = 0;
      const reporter = createReporter({ env: {}, now: () => time, stream });
      reporter.start('client');
      reporter.start('server');
      time = 200;
      reporter.progress('client', 0.5, 'building');
      const drawn = output(stream);
      reporter.progress('server', 0.9, 'sealing');

      expect(reporter.interactive).toBe(true);
      expect(drawn).toContain(' 50%  ');
      expect(output(stream)).toBe(drawn);
    });

    it('aligns the names known so far and writes colours only when forced', () => {
      const stream = fakeStream(false);
      const reporter = createReporter({ env: { FORCE_COLOR: '1' }, stream });
      reporter.start('server-app');
      reporter.start('client');

      expect(output(stream)).toContain('\u001B[');
      expect(output(stream)).toContain('client    ');
    });
  });
});
