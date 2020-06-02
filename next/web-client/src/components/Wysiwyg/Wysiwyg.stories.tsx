import React from 'react';
import { withCssResources } from '@storybook/addon-cssresources';
import { withKnobs } from '@storybook/addon-knobs';

import WysiwygComponent from './index';

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default {
  title: 'Component',
  parameters: {
    info: {
      text: `
    # Button
    description or documentation about my component, supports markdown

    ~~~jsx
    <Button>Click Here</Button>
    ~~~
  `,
    },
    cssresources: [
      {
        id: 'bluetheme',
        code: '<style> body button { font-family: Tahoma; } </style>',
        picked: false,
      },
    ],
  },
  decorators: [withCssResources, withKnobs],
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Wysiwyg = (): JSX.Element => (
  <WysiwygComponent
    value="<h1>Test text</h1>"
    //eslint-disable-next-line no-console
    onChange={(file): void => console.log(file)}
  />
);
