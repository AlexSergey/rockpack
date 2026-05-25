import React from 'react';

import logo from '../assets/styles/logo.svg';
import './App.css';

const logoData = `data:image/svg+xml;base64,${window.btoa(logo)}`;

export const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <img alt="logo" className="App-logo" src={logoData} />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
      To get started, edit <code>src/app.tsx</code> and save to reload.
    </p>
  </div>
);
