import { ReactElement } from 'react';

import { PhotosUpload as PhotosUploadComponent } from './index';

export default {
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
  },
  title: 'Component',
};

export const PhotosUpload = (): ReactElement => (
  <PhotosUploadComponent
    // eslint-disable-next-line no-console
    onChange={(files): void => console.log(files)}
  />
);
