export const createTestMatch = (src: string[], prefix: string): string[] =>
  src.map((s) => `<rootDir>${s}/**/*.${prefix}.{js,jsx,ts,tsx}`);
