declare namespace IndexModulesCssModule {
  export interface IIndexModulesCss {
    block: string;
  }
}

declare const IndexModulesCssModule: IndexModulesCssModule.IIndexModulesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModulesCssModule.IIndexModulesCss;
};

export = IndexModulesCssModule;
