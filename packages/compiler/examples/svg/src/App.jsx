import React, { Component } from 'react';
import './App.css';
import './kiwi.css';
import SvgLogo from './logo.component.svg';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <SvgLogo style={{width: '100px', height: '100px'}} />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="kiwi" />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
