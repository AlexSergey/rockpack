import React, { useState } from 'react';

import { useRest } from './rest';

export const App: React.FC = () => {
  const [state, setData] = useState('');
  const rest = useRest();

  return (
    <div>
      <div id="data">{state}</div>
      <button
        onClick={() => {
          if (rest) {
            void rest.post('/getData').then(({ data }: { data: { name: string } }) => {
              setData(data.name);
            });
          }
        }}
        type="button"
      >
        Test request
      </button>
    </div>
  );
};
