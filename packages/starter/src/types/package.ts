export type DependencyGroups = {
  dependencies?: Dependency[];
  devDependencies?: Dependency[];
  peerDependencies?: Dependency[];
};

export type PackageJsonObject = Record<string, unknown>;

type Dependency = {
  name: string;
  version: string;
};
