import { RockpackError } from '../errors/rockpack-error.js';
import { logError } from '../utils/log.js';

// The exported compilers are the only place that turns a RockpackError into a failed exit status.
export const withErrorBoundary = async <T>(task: () => Promise<T>): Promise<T> => {
  try {
    return await task();
  } catch (error) {
    if (error instanceof RockpackError) {
      logError(error);
      process.exitCode = 1;
    }
    throw error;
  }
};
