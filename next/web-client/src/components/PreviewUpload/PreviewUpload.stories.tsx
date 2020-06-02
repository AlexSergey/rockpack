import React from 'react';
import { withCssResources } from '@storybook/addon-cssresources';
import { withKnobs } from '@storybook/addon-knobs';
import StyleContext from 'isomorphic-style-loader/StyleContext';

import PreviewUploadComponent from './index';

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
export const PreviewUpload = (): JSX.Element => (
  <StyleContext.Provider value={{ insertCss: (): void => {} }}>
    <PreviewUploadComponent
      //eslint-disable-next-line no-console
      onChange={(file): void => console.log(file)}
    />
  </StyleContext.Provider>
);
