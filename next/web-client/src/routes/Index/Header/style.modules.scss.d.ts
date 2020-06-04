declare namespace StyleModulesScssModule {
  export interface IStyleModulesScss {
    "nav-holder": string;
    "nav-main": string;
    "nav-secondary": string;
  }
}

declare const StyleModulesScssModule: StyleModulesScssModule.IStyleModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModulesScssModule.IStyleModulesScss;
};

export = StyleModulesScssModule;
