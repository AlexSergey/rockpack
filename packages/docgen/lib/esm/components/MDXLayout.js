import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Container, baseStyles } from 'unified-ui';
import CodeBlock from './CodeBlock';
const Style = ({ children }) => (React.createElement("style", { dangerouslySetInnerHTML: {
        __html: children
    } }));
const defaultComponents = {
    code: CodeBlock
};
const MDXLayout = (props) => (React.createElement(MDXProvider, { components: Object.assign({}, defaultComponents, props.components), className: "mdx-provider" },
    React.createElement(React.Fragment, null,
        React.createElement(Style, null, baseStyles),
        React.createElement(Container, Object.assign({}, props)))));
export default MDXLayout;
