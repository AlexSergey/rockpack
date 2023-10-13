import Highlight, { Language, defaultProps } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/dracula';
import { ReactElement } from 'react';

export const Code = ({ code, language }: { code: string; language: Language }): ReactElement => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <Highlight {...defaultProps} code={code} language={language} theme={dracula}>
    {({ className, getLineProps, getTokenProps, style, tokens }): ReactElement => (
      <pre className={className} style={style}>
        {tokens.map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div {...getLineProps({ line })} key={i}>
            {line.map((token, key) => (
              // eslint-disable-next-line react/no-array-index-key
              <span {...getTokenProps({ token })} key={key} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);
