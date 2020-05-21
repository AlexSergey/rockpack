import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Service from '../../library/src';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }
  componentDidMount() {
    const service = new Service('http://localhost:3005');
    service.getData()
      .then(data => data.json())
      .then(data => {
        this.setState({
          list: data.anArray
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        {this.state.list.map((item, index) => {
          return <div key={index}>{item}</div>;
        })}
      </div>
    );
  }
}

export default App;
