declare namespace StyleModulesScssModule {
  export interface IStyleModulesScss {
    full: string;
    grid: string;
    "grid-column": string;
    images: string;
  }
}

declare const StyleModulesScssModule: StyleModulesScssModule.IStyleModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModulesScssModule.IStyleModulesScss;
};

export = StyleModulesScssModule;
