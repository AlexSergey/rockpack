import { mdx } from '@mdx-js/react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

interface CodeBlockInterface {
  children: string;
  className?: string;
  live?: string;
  render?: boolean;
}

const CodeBlock = ({ children, className, live, render }: CodeBlockInterface): JSX.Element => {
  const language: Language =
    typeof className === 'string' && className.indexOf('language') > 0
      ? (className.replace(/language-/, '') as Language)
      : 'jsx';

  if (live) {
    return (
      <div
        style={{
          backgroundColor: 'rgb(42, 39, 52)',
          caretColor: 'white',
        }}
      >
        <LiveProvider code={children.trim()} transformCode={(code): string => `/** @jsx mdx */${code}`} scope={{ mdx }}>
          <LivePreview />
          <LiveEditor />
          <div style={{ color: 'white' }}>
            <LiveError />
          </div>
        </LiveProvider>
      </div>
    );
  }

  if (render) {
    return (
      <div>
        <LiveProvider code={children}>
          <LivePreview />
        </LiveProvider>
      </div>
    );
  }

  return (
    <Highlight {...defaultProps} code={children.trim()} language={language}>
      {({ className: preClassName, style, tokens, getLineProps, getTokenProps }): JSX.Element => (
        <pre className={preClassName} style={{ ...style, overflow: 'auto', padding: '20px' }}>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} {...getLineProps({ key: i, line })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={key} {...getTokenProps({ key, token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
