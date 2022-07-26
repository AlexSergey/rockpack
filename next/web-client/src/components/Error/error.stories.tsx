import React from 'react';

import { Error as ErrorComponent } from './index';

export default {
  parameters: {
    info: {
      text: `
    # Error
    Error message component

    ~~~jsx
    <Error />
    ~~~
  `,
    },
  },
  title: 'Component',
};

export const Error = (): JSX.Element => <ErrorComponent />;
