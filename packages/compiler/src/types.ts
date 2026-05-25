export interface CompilerConf {
  analyzer?: boolean;
  babelPresetsAdditionalOptions?: Record<string, Record<string, unknown>>;
  banner?: false | string;
  cjs?: FormatConf;
  copy?: CopyConf;
  debug?: boolean;
  dist: string;
  esm?: FormatConf;
  externals?: unknown;
  global?: Record<string, string>;
  html?: boolean | HtmlPage | HtmlPage[];
  library?: string;
  messages: string[];
  name?: string;
  port?: number;
  src: string;
  styles?: false | string;
  types?: string;
  vendor?: string[];
  version?: string;
}

export type CopyConf = CopySpec | CopySpec[] | { files: CopySpec[]; opts?: Record<string, unknown> };

export interface FormatConf {
  dist: string;
  src: string;
}

export interface HtmlPage {
  code?: null | string | undefined;
  favicon?: null | string | undefined;
  filename?: false | string;
  inject?: false;
  minify?: { collapseWhitespace: boolean };
  template?: string;
  templateParameters?: Record<string, unknown>;
  title?: string;
}

export type InternalCompilerConf = CompilerConf & InternalProps;

export interface InternalProps {
  __isBackend?: boolean;
  __isIsomorphic?: boolean;
  __isIsomorphicBackend?: boolean;
  __isIsomorphicFrontend?: boolean;
  __isIsomorphicStyles?: boolean;
  __library?: boolean;
  compilerName?: string;
  distContext?: string;
  nodejs?: boolean;
}

export type Mode = 'development' | 'production';

export interface PackageJson {
  [key: string]: unknown;
  author?: string;
  description?: string;
  email?: string;
  license?: string;
  name?: string;
  version?: string;
}

interface CopySpec {
  from: string;
  to: string;
}
