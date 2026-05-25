import React from 'react';

import gif from './gif-test.gif';
import './App.css';
import jpg from './jpg-test.jpg';
import logo from './logo.svg';
import png from './png-test.png';

export const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <img alt="logo" className="App-logo" src={logo} />
    </header>
    <img alt="jpg" className="jpg" src={jpg} />
    <img alt="png" className="png" src={png} />
    <img alt="gif" className="gif" src={gif} />
  </div>
);
