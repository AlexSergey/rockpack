import React from 'react';

import logo from './logo.svg';
import './App.css';

export const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <img alt="logo" className="App-logo" src={logo} />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
      To get started, edit <code>src/app.tsx</code> and save to reload.
    </p>
  </div>
);
