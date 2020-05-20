declare namespace StylesModulesScssModule {
  export interface IStylesModulesScss {
    "table-wrap": string;
  }
}

declare const StylesModulesScssModule: StylesModulesScssModule.IStylesModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesModulesScssModule.IStylesModulesScss;
};

export = StylesModulesScssModule;
