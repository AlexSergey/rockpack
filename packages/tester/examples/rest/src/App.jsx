import React, { useState } from 'react';
import { useRest } from './rest';

const App = () => {
    let [ state, setData ] = useState('');
    let rest = useRest();

    return <div>
        <div id="data">
            {state}
        </div>
        <button onClick={() => {
            rest.post('/getData').then(({ data }) => {
                setData(data.name);
            })
        }}>Test request</button>
    </div>
}

export default App;
