import type { RockpackError } from '../errors/rockpack-error.js';

export const logError = (error: RockpackError): void => {
  console.error(`[rockpack] ${error.code}: ${error.message}`);
};
