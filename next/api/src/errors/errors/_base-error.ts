// eslint-disable-next-line check-file/filename-naming-convention
export class BaseError extends Error {
  constructor() {
    super();
    this.name = 'BaseError';
  }
}
