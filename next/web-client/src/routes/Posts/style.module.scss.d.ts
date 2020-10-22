declare namespace StyleModuleScssNamespace {
  export interface IStyleModuleScss {
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

declare const StyleModuleScssModule: StyleModuleScssNamespace.IStyleModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleModuleScssNamespace.IStyleModuleScss;
};

export = StyleModuleScssModule;
