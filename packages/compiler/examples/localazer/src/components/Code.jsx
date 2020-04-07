import React from 'react';
import AceEditor from 'react-ace';
import 'brace';
import 'brace/mode/jsx';
import 'brace/theme/twilight';

const Code = props => {
  const height = props.height || '500px';
  const width = props.width || '500px';

  return (
    <AceEditor
      fontSize={16}
      mode="jsx"
      theme="twilight"
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      value={props.value}
      height={height}
      width={width}
    />
  );
};

export default Code;
