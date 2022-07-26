import Highlight, { defaultProps } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/dracula';
import propTypes from 'prop-types';
import React from 'react';

export const Code = ({ code, language }) => (
  <Highlight {...defaultProps} theme={dracula} code={code} language={language}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
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

Code.propTypes = {
  code: propTypes.string.isRequired,
  language: propTypes.string.isRequired,
};
