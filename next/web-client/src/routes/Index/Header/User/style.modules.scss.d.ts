declare namespace StyleModulesScssModule {
  export interface IStyleModulesScss {
    email: string;
    holder: string;
    role: string;
    user: string;
  }
}

declare const StyleModulesScssModule: StyleModulesScssModule.IStyleModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModulesScssModule.IStyleModulesScss;
};

export = StyleModulesScssModule;
