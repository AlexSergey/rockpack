import { glob } from 'glob';
import path from 'node:path';

import type { HtmlPage } from '../types.js';

import * as errors from '../errors/markup-compiler.js';

export async function findHtml(pth: string, html: HtmlPage | HtmlPage[] | undefined = []): Promise<HtmlPage[]> {
  const files = await glob(pth, { absolute: true });

  const pages: HtmlPage[] = Array.isArray(html) ? html : html !== undefined ? [html] : [];

  if (files.length === 0) {
    console.error(errors.INVALID_PATH);
    process.exit(1);
  }

  return pages.concat(
    files.map((file) => ({
      template: path.resolve(file),
    })),
  );
}
