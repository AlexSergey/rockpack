import React from 'react';

import { Loader as LoaderCompoennt } from './index';

export default {
  parameters: {
    info: {
      text: `
    # Loader
    Loader component with Spinner

    ~~~jsx
    <Loader />
    ~~~
  `,
    },
  },
  title: 'Component',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Loader = (): JSX.Element => <LoaderCompoennt />;
