export type RockpackErrorCode = 'BUILD_FAILED' | 'DTS_FAILED' | 'INVALID_CONFIG' | 'INVALID_ENTRY';

export class RockpackError extends Error {
  readonly code: RockpackErrorCode;

  constructor(code: RockpackErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'RockpackError';
    this.code = code;
  }
}
