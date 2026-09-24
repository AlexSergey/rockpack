import type { Browser } from 'puppeteer';

export type { Browser, Page } from 'puppeteer';

import { existsSync } from 'node:fs';

// Puppeteer reads PUPPETEER_EXECUTABLE_PATH when it loads, so a path that does not exist is dropped before the import
// and puppeteer falls back to its own pinned browser.
export const launchBrowser = async (): Promise<Browser> => {
  const configured = process.env['PUPPETEER_EXECUTABLE_PATH'];
  if (configured && !existsSync(configured)) {
    delete process.env['PUPPETEER_EXECUTABLE_PATH'];
  }
  const { default: puppeteer } = await import('puppeteer');

  return puppeteer.launch({ args: ['--no-sandbox'], headless: true });
};
