import type { ReactElement } from 'react';

import { Head } from '@unhead/react';

import { Page } from './page';

export const App = (): ReactElement => {
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Head>
        <title>Rockpack</title>
        <meta
          content="Rockpack is a zero-configuration toolkit for building React applications with SSR, bundling, linting, testing, and built-in support for AI-assisted development."
          key="description"
          name="description"
        />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Page />
    </>
  );
};
