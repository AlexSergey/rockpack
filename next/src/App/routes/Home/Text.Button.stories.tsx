import React from 'react';
import { withCssResources } from '@storybook/addon-cssresources';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { TextButton } from './Text.Button';

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

export const defaultView = (): JSX.Element => (
  <TextButton
    text={text('Label', 'Hello Storybook')}
    disabled={boolean('Disabled', false)}
    count={number('Count', 1)}
    onClick={action('button-click')}
  />
);
