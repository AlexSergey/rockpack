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

export const PreviewUpload = (): JSX.Element => (
  <PreviewUploadComponent
    // eslint-disable-next-line no-console
    onChange={(file): void => console.log(file)}
  />
);
