declare namespace IndexModulesCssNamespace {
  export interface IIndexModulesCss {
    block: string;
  }
}

declare const IndexModulesCssModule: IndexModulesCssNamespace.IIndexModulesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModulesCssNamespace.IIndexModulesCss;
};

export = IndexModulesCssModule;
