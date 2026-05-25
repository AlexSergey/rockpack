export interface Versions {
  component: ComponentConfig;
  csr: {
    common: DependencyGroup;
  };
  git: {
    common: DependencyGroup;
  };
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

interface PackageDependency {
  name: string;
  version: string;
}

interface TesterConfig {
  common: DependencyGroup;
  react: DependencyGroup;
}
