declare namespace StyleModulesScssModule {
  export interface IStyleModulesScss {
    comments: string;
    post: string;
    "post-page": string;
    update: string;
  }
}

declare const StyleModulesScssModule: StyleModulesScssModule.IStyleModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModulesScssModule.IStyleModulesScss;
};

export = StyleModulesScssModule;
