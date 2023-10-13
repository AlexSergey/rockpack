import { ReactElement } from 'react';
import { Helmet } from 'react-helmet';

import { Page } from './page';

export const App = (): ReactElement => {
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Helmet>
        <title>Rockpack</title>
        <meta
          content="Rockpack is a simple solution for creating React Application with Server Side Rendering, bundling, linting, testing within 5 minutes"
          key="description"
          name="description"
        />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Helmet>
      <Page />
    </>
  );
};
