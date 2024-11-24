import { ReactElement } from 'react';

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

export const Loader = (): ReactElement => <LoaderCompoennt />;
