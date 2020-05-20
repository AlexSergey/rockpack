declare namespace TextButtonModulesScssModule {
  export interface ITextButtonModulesScss {
    btn: string;
  }
}

declare const TextButtonModulesScssModule: TextButtonModulesScssModule.ITextButtonModulesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TextButtonModulesScssModule.ITextButtonModulesScss;
};

export = TextButtonModulesScssModule;
