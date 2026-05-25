import React from 'react';

import './App.css';
import './kiwi.css';
import SvgLogo from './logo.component.svg';

export const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <SvgLogo style={{ height: '100px', width: '100px' }} />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <div className="kiwi" />
    <p className="App-intro">
      To get started, edit <code>src/app.tsx</code> and save to reload.
    </p>
  </div>
);
