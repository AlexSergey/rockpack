import { Button, Calendar, DatePicker } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';

const App: React.FC = () => (
  <div>
    <Button>Test</Button>
    <DatePicker />
    <Calendar />
  </div>
);

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
