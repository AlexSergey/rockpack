export interface Versions {
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
}

interface ComponentConfig {
  common: DependencyGroup;
}

interface DependencyGroup {
  dependencies?: PackageDependency[];
  devDependencies?: PackageDependency[];
  peerDependencies?: PackageDependency[];
}

interface LibraryConfig {
  common: {
    devDependencies: PackageDependency[];
  };
}

interface PackageDependency {
  name: string;
  version: string;
}

interface TesterConfig {
  common: DependencyGroup;
  react: DependencyGroup;
}
