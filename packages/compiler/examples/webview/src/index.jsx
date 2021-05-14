import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

document.addEventListener("DOMContentLoaded", function (event) {
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker();
});

