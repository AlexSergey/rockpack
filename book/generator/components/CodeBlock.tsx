/* eslint-disable no-shadow */
import React from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live';
import { mdx } from '@mdx-js/react';

interface CodeBlockInterface {
  children: string;
  className?: string;
  live?: string;
  render?: boolean;
}

const CodeBlock = ({ children, className, live, render }: CodeBlockInterface): JSX.Element => {
  const language: Language = typeof className === 'string' && className.indexOf('language') > 0 ?
    (className.replace(/language-/, '') as Language) :
    'jsx';

  if (live) {
    return (
      <div
        style={{
          backgroundColor: 'rgb(42, 39, 52)',
          caretColor: 'white'
        }}
      >
        <LiveProvider
          code={children.trim()}
          transformCode={(code): string => `/** @jsx mdx */${code}`}
          scope={{ mdx }}
        >
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
      {({ className, style, tokens, getLineProps, getTokenProps }): JSX.Element => (
        <pre className={className} style={{ ...style, padding: '20px', overflow: 'auto' }}>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
