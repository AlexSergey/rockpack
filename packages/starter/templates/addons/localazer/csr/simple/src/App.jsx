import React from 'react';
import Localization, { LocalizationObserver, l, getDefaultLocale } from '@rockpack/localazer';
import logo from './logo.svg';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
      <Localization>
        {l('Hello world')}
      </Localization>
    </p>
  </div>
);

export default () => (
  <LocalizationObserver active="en" languages={{ en: getDefaultLocale() }}>
    <App />
  </LocalizationObserver>
);
