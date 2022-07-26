declare namespace StyleModuleScssNamespace {
  export interface IStyleModuleScss {
    full: string;
    grid: string;
    "grid-column": string;
    images: string;
  }
}

declare const StyleModuleScssModule: StyleModuleScssNamespace.IStyleModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModuleScssNamespace.IStyleModuleScss;
};

export = StyleModuleScssModule;
