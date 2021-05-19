import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import jpg from './jpg-test.jpg';
import png from './png-test.png';
import gif from './gif-test.gif';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <img src={jpg} className="jpg" alt="jpg" />
        <img src={png} className="png" alt="png" />
        <img src={gif} className="gif" alt="gif" />
      </div>
    );
  }
}

export default App;
