import { ReactElement } from 'react';

import { PreviewUpload as PreviewUploadComponent } from './index';

export default {
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
  title: 'Component',
};

export const PreviewUpload = (): ReactElement => (
  <PreviewUploadComponent onChange={(file): void => console.log(file)} />
);
