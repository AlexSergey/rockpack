import React from 'react';

import PreviewUploadComponent from './index';

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default {
  title: 'Component',
  parameters: {
    info: {
      text: `
    # PreviewUpload
    Component provides upload logic with preview for single file. onChange will return File instance

    ~~~jsx
    <PreviewUpload
     onChange={(file) => console.log(file)}
    />
    ~~~
  `,
    },
  },
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PreviewUpload = (): JSX.Element => (
  <PreviewUploadComponent
    //eslint-disable-next-line no-console
    onChange={(file): void => console.log(file)}
  />
);
