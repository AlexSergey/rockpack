export class ExitError extends Error {
  readonly code: number | string | undefined;

  constructor(code: null | number | string | undefined) {
    super(`process.exit(${String(code)})`);
    this.code = code ?? undefined;
  }
}

export const mockProcessExit = (): jest.SpyInstance =>
  jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new ExitError(code);
  });
