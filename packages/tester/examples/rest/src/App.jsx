import React, { useState } from 'react';
import { useRest } from './rest';

const App = () => {
  const [state, setData] = useState('');
  const rest = useRest();
  
  return (
    <div>
      <div id="data">
        {state}
      </div>
      <button
        type="button"
        onClick={() => {
          rest.post('/getData')
            .then(({ data }) => {
              setData(data.name);
            });
        }}
      >
        Test request
      </button>
    </div>
  );
}

export default App;
