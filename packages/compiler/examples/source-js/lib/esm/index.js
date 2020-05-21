import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.css';
import App from './component/App';
import registerServiceWorker from './utils/client/registerServiceWorker';
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));
registerServiceWorker();