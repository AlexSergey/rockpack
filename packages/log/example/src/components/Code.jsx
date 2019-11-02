import React from 'react';
import AceEditor from 'react-ace';
import 'brace';
import 'brace/mode/jsx';
import 'brace/theme/twilight';

const Code = props => {
    let height = props.height || '500px';
    let width = props.width || '500px';

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
            style={{marginBottom: '20px'}}
        />
    );
};

export default Code;
