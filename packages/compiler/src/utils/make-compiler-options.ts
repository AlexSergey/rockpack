import deepExtend from 'deep-extend';
import path from 'node:path';
import ts from 'typescript';

// The project's tsconfig with declaration-only output into `outDir`. Module and resolution settings stay the
// project's own, so the declarations resolve imports exactly like its type check does.
export function makeCompilerOptions(root: string, pth: string, outDir: string): ts.ParsedCommandLine {
  const parseConfigHost: ts.ParseConfigHost = {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    fileExists: ts.sys.fileExists,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    readDirectory: ts.sys.readDirectory,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    readFile: ts.sys.readFile,
    useCaseSensitiveFileNames: true,
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, path.resolve(root, pth));
  if (!configPath) {
    throw new Error(`Could not find tsconfig at ${pth}`);
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  deepExtend(configFile.config, {
    compilerOptions: { declaration: true, emitDeclarationOnly: true, noEmit: false, outDir },
  });

  return ts.parseJsonConfigFileContent(configFile.config, parseConfigHost, root);
}
