import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Container, baseStyles } from 'unified-ui';

import CodeBlock from './CodeBlock';

const Style = ({children}) => (
    <style
        dangerouslySetInnerHTML={{
            __html: children
        }}
    />
);

const components = {
    code: CodeBlock
};

const MDXLayout = props => (
    <MDXProvider components={Object.assign({}, components, props.components)} className="mdx-provider">
        <>
            <Style>{baseStyles}</Style>
            <Container {...props} />
        </>
    </MDXProvider>
);

export default MDXLayout;
