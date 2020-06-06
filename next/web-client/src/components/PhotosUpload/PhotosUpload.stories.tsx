import React from 'react';

import PhotosUploadComponent from './index';

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default {
  title: 'Component',
  parameters: {
    info: {
      text: `
    # PhotosUpload
    Component provides upload logic with preview for single multifiles. onChange will return list of File instances

    ~~~jsx
    <PhotosUpload
     onChange={(files) => console.log(files)}
    />
    ~~~
  `,
    },
  }
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PhotosUpload = (): JSX.Element => (
  <PhotosUploadComponent
    //eslint-disable-next-line no-console
    onChange={(files): void => console.log(files)}
  />
);
