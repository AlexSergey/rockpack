declare module 'deep-extend' {
  const deepExtend: <T extends object>(target: T, ...sources: Partial<T>[]) => T;
  export = deepExtend;
}

declare module 'identity-obj-proxy' {
  const proxy: Record<string, string>;
  export = proxy;
}
