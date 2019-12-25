import React from 'react';
import ReactDOM from 'react-dom';
import { Rest } from './rest';
import App from './App';

ReactDOM.render(
    <Rest options={{
        baseURL: 'http://localhost:4000/'
    }}>
        <App />
    </Rest>, document.getElementById('root'));
