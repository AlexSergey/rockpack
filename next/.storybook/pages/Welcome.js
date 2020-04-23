import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Welcome', module)
  .add('to your new Storubook!',
    () => (
      <div style={{ padding: '10px', background: 'white', height: '100%' }}>
        <h1>Hi!</h1>
      </div>
    ), {
      info: {
        source: false,
        header: false,
        inline: false,
        button: false,
        styles: {
          button: {
            base: {
              display: 'none',
            }
          }
        },
      },
      options: {
        showPanel: false
      }
    })