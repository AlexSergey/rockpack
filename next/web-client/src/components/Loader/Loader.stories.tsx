import React from 'react';

import { Loader as LoaderCompoennt } from './index';

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default {
  title: 'Component',
  parameters: {
    info: {
      text: `
    # Loader
    Loader component with Spinner

    ~~~jsx
    <Loader />
    ~~~
  `,
    }
  }
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Loader = (): JSX.Element => (
  <LoaderCompoennt />
);
