import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ColorComponent from './1/Color.Component';

const logoData = `data:image/svg+xml;base64,${window.btoa(logo)}`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logoData} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          <ColorComponent color="red"></ColorComponent>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
