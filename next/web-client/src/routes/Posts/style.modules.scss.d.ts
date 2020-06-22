declare namespace StyleModulesScssNamespace {
  export interface IStyleModulesScss {
    comments: string;
    date: string;
    delete: string;
    extra: string;
    post: string;
    "post-last": string;
    posts: string;
    "preview-holder": string;
    title: string;
  }
}

declare const StyleModulesScssModule: StyleModulesScssNamespace.IStyleModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModulesScssNamespace.IStyleModulesScss;
};

export = StyleModulesScssModule;
