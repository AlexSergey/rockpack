import { RockpackError } from './errors/rockpack-error.js';

const SIGNAL_EXIT_CODES = { SIGINT: 130, SIGTERM: 143 } as const;

let registered = false;

const fail = (error: unknown, label: string): void => {
  console.error(error, label);
  process.exitCode = 1;
  process.exit();
};

// Process-level listeners, registered once even when several compilers start (isomorphicCompiler).
export const errorHandler = (): void => {
  if (registered) return;
  registered = true;

  process.on('unhandledRejection', (reason) => {
    if (reason instanceof RockpackError) {
      // Already reported by the compiler's error boundary.
      process.exitCode = 1;

      return;
    }
    fail(reason, 'Unhandled Rejection');
  });

  process.on('uncaughtException', (error) => {
    fail(error, 'Unhandled Exception');
  });

  process.on('warning', (warning) => {
    console.error(warning, 'Warning detected');
  });

  for (const [signal, code] of Object.entries(SIGNAL_EXIT_CODES)) {
    process.once(signal, () => {
      process.exit(code);
    });
  }
};
