declare namespace StyleModulesScssNamespace {
  export interface IStyleModulesScss {
    email: string;
    holder: string;
    role: string;
    user: string;
  }
}

declare const StyleModulesScssModule: StyleModulesScssNamespace.IStyleModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModulesScssNamespace.IStyleModulesScss;
};

export = StyleModulesScssModule;
