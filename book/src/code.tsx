import { Highlight, Language, RenderProps, themes } from 'prism-react-renderer';
import { ReactElement } from 'react';

export const Code = ({ code, language }: { code: string; language: Language }): ReactElement => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <Highlight code={code.substring(0, code.length - 1)} language={language} theme={themes.shadesOfPurple}>
    {({ getLineProps, getTokenProps, style, tokens }: RenderProps) => (
      <pre style={style}>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);
