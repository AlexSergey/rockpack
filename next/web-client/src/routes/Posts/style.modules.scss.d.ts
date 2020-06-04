declare namespace StyleModulesScssModule {
  export interface IStyleModulesScss {
    comments: string;
    date: string;
    delete: string;
    extra: string;
    post: string;
    posts: string;
    "preview-holder": string;
    title: string;
  }
}

declare const StyleModulesScssModule: StyleModulesScssModule.IStyleModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModulesScssModule.IStyleModulesScss;
};

export = StyleModulesScssModule;
