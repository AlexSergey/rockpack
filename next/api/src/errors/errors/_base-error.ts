export class BaseError extends Error {
  constructor() {
    super();
    this.name = 'BaseError';
  }
}
