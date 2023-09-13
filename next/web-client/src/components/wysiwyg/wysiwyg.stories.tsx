import { Wysiwyg as WysiwygComponent } from './index';

export default {
  parameters: {
    info: {
      text: `
    # Wysiwyg
    A Wysiwyg editor

    ~~~jsx
    <Wysiwyg value={text} onChange={(value) => console.log(value)} />
    ~~~
  `,
    },
  },
  title: 'Component',
};

export const Wysiwyg = (): JSX.Element => (
  // eslint-disable-next-line no-console
  <WysiwygComponent value="<h1>Test</h1>" onChange={(value): void => console.log(value)} />
);
