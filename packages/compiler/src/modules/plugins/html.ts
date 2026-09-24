import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'node:path';

import type { HtmlPage } from '../../types.js';
import type { PluginContext, PluginEntries } from './types.js';

import { getTitle } from '../../utils/other.js';
import { compilerRoot } from '../../utils/package-root.js';

const getPages = ({ conf, packageJson }: PluginContext, defaultTemplate: string): HtmlPage[] => {
  if (conf.html && Array.isArray(conf.html)) {
    return conf.html;
  }
  const page = conf.html && typeof conf.html !== 'boolean' ? conf.html : undefined;

  return [
    {
      code: page?.code ? page.code : null,
      favicon: page?.favicon ? page.favicon : null,
      filename: page?.filename ? page.filename : false,
      template: page?.template || defaultTemplate,
      title: page?.title || (getTitle(packageJson) ? String(getTitle(packageJson)) : ''),
    },
  ];
};

export const makeHtmlPlugins = (ctx: PluginContext): PluginEntries => {
  const { compileContext, conf, mode } = ctx;
  if ((typeof conf.html === 'boolean' && !conf.html) || compileContext.isomorphic) {
    return {};
  }
  const defaultTemplate = path.join(compilerRoot(), 'index.ejs');

  return Object.fromEntries(
    getPages(ctx, defaultTemplate).map((page, index) => {
      const template = page.template || defaultTemplate;
      const filename =
        page.filename || `${template.slice(template.lastIndexOf(path.sep) + 1, template.lastIndexOf('.'))}.html`;
      const { favicon, ...rest } = page;

      return [
        `HtmlWebpackPlugin${index}`,
        new HtmlWebpackPlugin({
          ...rest,
          ...(favicon ? { favicon } : {}),
          filename,
          inject: false,
          minify: { collapseWhitespace: mode === 'production' },
          template,
          templateParameters: { version: typeof conf.version === 'string' ? conf.version : '1.0.0' },
        }),
      ];
    }),
  );
};
