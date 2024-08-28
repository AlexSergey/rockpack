import { storiesOf } from '@storybook/react';
import React from 'react';

storiesOf('Welcome', module).add(
  'to your new Storubook!',
  () => (
    <div style={{ background: 'white', height: '100%', padding: '10px' }}>
      <h1>Hi!</h1>
    </div>
  ),
  {
    info: {
      button: false,
      header: false,
      inline: false,
      source: false,
      styles: {
        button: {
          base: {
            display: 'none',
          },
        },
      },
    },
    options: {
      showPanel: false,
    },
  },
);
