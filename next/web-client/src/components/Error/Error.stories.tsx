import React from 'react';

import { Error as ErrorCompoennt } from './index';

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default {
  title: 'Component',
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
  }
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Error = (): JSX.Element => (
  <ErrorCompoennt />
);
