declare module 'deep-extend' {
  function deepExtend(target: object, ...sources: readonly object[]): Record<string, unknown>;
  export = deepExtend;
}
