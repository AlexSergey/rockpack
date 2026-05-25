export interface DependencyGroups {
  dependencies?: Dependency[];
  devDependencies?: Dependency[];
  peerDependencies?: Dependency[];
}

export type PackageJsonObject = Record<string, unknown>;

interface Dependency {
  name: string;
  version: string;
}
