import React from 'react';
import ReactDOM from 'react-dom';
import { Button, DatePicker, Calendar } from 'antd';

const App = () => (
  <div>
    <Button>Test</Button>
    <DatePicker />
    <Calendar />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
