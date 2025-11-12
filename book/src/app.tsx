import { Head } from '@unhead/react';
import { ReactElement } from 'react';

import { Page } from './page';

export const App = (): ReactElement => {
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Head>
        <title>Rockpack</title>
        <meta
          content="Rockpack is a lightweight, zero-configuration solution for quickly setting up a React application with full support for Server-Side Rendering (SSR), bundling, linting, and testing."
          key="description"
          name="description"
        />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Page />
    </>
  );
};
