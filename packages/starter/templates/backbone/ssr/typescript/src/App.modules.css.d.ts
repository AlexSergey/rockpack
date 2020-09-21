declare namespace AppModulesCssNamespace {
  export interface IAppModulesCss {
    App: string;
    "App-header": string;
    "App-logo": string;
  }
}

declare const AppModulesCssModule: AppModulesCssNamespace.IAppModulesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppModulesCssNamespace.IAppModulesCss;
};

export = AppModulesCssModule;
