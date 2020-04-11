import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { mdx } from '@mdx-js/react';
const CodeBlock = ({ children, className, live, render }) => {
    const language = typeof className === 'string' && className.indexOf('language') > 0 ?
        className.replace(/language-/, '') :
        'jsx';
    if (live) {
        return (React.createElement("div", { style: {
                backgroundColor: 'rgb(42, 39, 52)',
                caretColor: 'white'
            } },
            React.createElement(LiveProvider, { code: children.trim(), transformCode: code => `/** @jsx mdx */${code}`, scope: { mdx } },
                React.createElement(LivePreview, null),
                React.createElement(LiveEditor, null),
                React.createElement("div", { style: { color: 'white' } },
                    React.createElement(LiveError, null)))));
    }
    if (render) {
        return (React.createElement("div", null,
            React.createElement(LiveProvider, { code: children },
                React.createElement(LivePreview, null))));
    }
    return (React.createElement(Highlight, Object.assign({}, defaultProps, { code: children.trim(), language: language }), ({ className, style, tokens, getLineProps, getTokenProps }) => (React.createElement("pre", { className: className, style: Object.assign(Object.assign({}, style), { padding: '20px', overflow: 'auto' }) }, tokens.map((line, i) => (React.createElement("div", Object.assign({ key: i }, getLineProps({ line, key: i })), line.map((token, key) => (React.createElement("span", Object.assign({ key: key }, getTokenProps({ token, key }))))))))))));
};
export default CodeBlock;
