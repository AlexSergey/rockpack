declare namespace StyleModuleScssNamespace {
  export interface IStyleModuleScss {
    "error-block": string;
  }
}

declare const StyleModuleScssModule: StyleModuleScssNamespace.IStyleModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModuleScssNamespace.IStyleModuleScss;
};

export = StyleModuleScssModule;
