declare namespace StylesModuleLessNamespace {
  export interface IStylesModuleLess {
    submit: string;
  }
}

declare const StylesModuleLessModule: StylesModuleLessNamespace.IStylesModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesModuleLessNamespace.IStylesModuleLess;
};

export = StylesModuleLessModule;
