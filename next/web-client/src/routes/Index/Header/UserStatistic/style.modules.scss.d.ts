declare namespace StyleModulesScssNamespace {
  export interface IStyleModulesScss {
    item: string;
    statistic: string;
  }
}

declare const StyleModulesScssModule: StyleModulesScssNamespace.IStyleModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModulesScssNamespace.IStyleModulesScss;
};

export = StyleModulesScssModule;
