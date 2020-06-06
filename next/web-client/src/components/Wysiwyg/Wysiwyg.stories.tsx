import React from 'react';

import WysiwygComponent from './index';

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default {
  title: 'Component',
  parameters: {
    info: {
      text: `
    # Wysiwyg
    A Wysiwyg editor

    ~~~jsx
    <Wysiwyg value={text} onChange={(value) => console.log(value)} />
    ~~~
  `,
    }
  },
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Wysiwyg = (): JSX.Element => (
  //eslint-disable-next-line no-console
  <WysiwygComponent value={'<h1>Test</h1>'} onChange={(value): void => console.log(value)} />
);
