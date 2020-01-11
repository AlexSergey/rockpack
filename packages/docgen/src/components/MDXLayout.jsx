import React from 'react';
import propTypes from 'prop-types';
import { MDXProvider } from '@mdx-js/react';
import { Container, baseStyles } from 'unified-ui';

import CodeBlock from './CodeBlock';

const Style = ({ children }) => (
    <style
        dangerouslySetInnerHTML={{
            __html: children
        }}
    />
);
Style.propTypes = {
    children: propTypes.string.isRequired
};

const defaultComponents = {
    code: CodeBlock
};

const MDXLayout = props => (
    <MDXProvider components={Object.assign({}, defaultComponents, props.components)} className="mdx-provider">
        <>
            <Style>{baseStyles}</Style>
            <Container {...props} />
        </>
    </MDXProvider>
);
MDXLayout.propTypes = {
    components: propTypes.shape({
        h1: propTypes.element,
        h2: propTypes.element,
        h3: propTypes.element,
        h4: propTypes.element,
        h5: propTypes.element,
        h6: propTypes.element
    })
};

export default MDXLayout;
