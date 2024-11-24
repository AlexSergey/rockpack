import { ReactElement } from 'react';

import { Wysiwyg as WysiwygComponent } from './index';

export default {
  parameters: {
    info: {
      text: `
    # Wysiwyg
    A Wysiwyg editor

    ~~~jsx
    <Wysiwyg value={text} onChange={(value) => console.log(value)} />
    ~~~
  `,
    },
  },
  title: 'Component',
};

export const Wysiwyg = (): ReactElement => (
  <WysiwygComponent onChange={(value): void => console.log(value)} value="<h1>Test</h1>" />
);
