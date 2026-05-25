import type { RenderProps } from 'prism-react-renderer';
import type { ReactNode } from 'react';

import { Highlight } from 'prism-react-renderer';
import React from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

interface CodeBlockProps {
  children?: ReactNode;
  className?: string | undefined;
  live?: boolean | undefined;
  render?: boolean | undefined;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, className = '', live, render: renderLive }) => {
  const language = className.replace(/language-/, '');
  const code = typeof children === 'string' ? children : '';

  if (live) {
    return (
      <div style={{ backgroundColor: 'black', caretColor: 'white', marginTop: '40px' }}>
        <LiveProvider code={code.trim()} transformCode={(c) => '/** @jsx mdx */' + c}>
          <LivePreview />
          <LiveEditor />
          <LiveError />
        </LiveProvider>
      </div>
    );
  }

  if (renderLive) {
    return (
      <div style={{ marginTop: '40px' }}>
        <LiveProvider code={code}>
          <LivePreview />
        </LiveProvider>
      </div>
    );
  }

  return (
    <Highlight code={code.trim()} language={language}>
      {({ className: cls, getLineProps, getTokenProps, style, tokens }: RenderProps) => (
        <pre className={cls} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <div key={i} {...getLineProps({ key: i, line })}>
              {line.map((token, key) => (
                // eslint-disable-next-line @eslint-react/no-array-index-key
                <span key={key} {...getTokenProps({ key, token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
