import path from 'node:path';

export const getOutputFileMeta = (compilation: { assets: Record<string, unknown> }, outputPath: string): string => {
  const outputFileName = Object.keys(compilation.assets).find((file) => path.extname(file) === '.js') ?? '';
  const absoluteFileName = path.join(outputPath, outputFileName);

  return path.relative('', absoluteFileName);
};
