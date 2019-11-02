import React from 'react';
import ReactDOM from 'react-dom';
import MDXLayout from './components/MDXLayout';
import Readme from './readme.mdx';

console.log(Readme);

const App = () => {
    return <MDXLayout>
        <Readme />
    </MDXLayout>
};

ReactDOM.render(<App />, document.getElementById('root'));
