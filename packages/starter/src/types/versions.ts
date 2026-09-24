export type Versions = {
  component: ComponentConfig;
  csr: {
    common: DependencyGroup;
  };
  git: {
    common: DependencyGroup;
  };
  library: LibraryConfig;
  ssr: {
    common: DependencyGroup;
  };
  tester: TesterConfig;
};

type ComponentConfig = {
  common: DependencyGroup;
};

type DependencyGroup = {
  dependencies?: PackageDependency[];
  devDependencies?: PackageDependency[];
  peerDependencies?: PackageDependency[];
};

type LibraryConfig = {
  common: {
    devDependencies: PackageDependency[];
  };
};

type PackageDependency = {
  name: string;
  version: string;
};

type TesterConfig = {
  common: DependencyGroup;
  react: DependencyGroup;
};
