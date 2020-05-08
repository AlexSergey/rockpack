import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Container, baseStyles } from 'unified-ui';

import CodeBlock from './CodeBlock';

interface StyleInterface {
  children: string;
}

const Style = ({ children }: StyleInterface): JSX.Element => (
  <style
    dangerouslySetInnerHTML={{
      __html: children
    }}
  />
);

const defaultComponents = {
  code: CodeBlock
};

interface MDXLayoutInterface {
  components: {
    h1: JSX.Element;
    h2: JSX.Element;
    h3: JSX.Element;
    h4: JSX.Element;
    h5: JSX.Element;
    h6: JSX.Element;
  };
}

const MDXLayout = (props: MDXLayoutInterface): JSX.Element => (
  <MDXProvider components={Object.assign({}, defaultComponents, props.components)} className="mdx-provider">
    <>
      <Style>{baseStyles}</Style>
      <Container {...props} />
    </>
  </MDXProvider>
);

export default MDXLayout;
