import React from 'react';
import ReactDOM from 'react-dom';
import Readme from './readme.mdx';

import CodeBlock from './components/CodeBlock';

const components = {
  h1: props => <h1 style={{ color: 'tomato' }} {...props} />,
  pre: props => <div {...props} />,
  code: CodeBlock
};

const App = () => {
    return <Readme components={components} />
};

ReactDOM.render(<App />, document.getElementById('root'));
