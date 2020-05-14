import React from 'react';

const Approach = () => {
    return <>
        <h3>Approach</h3>
        <p><strong>LogRock</strong> has 2 things:</p>
        <ol>
            <li>LoggerContainer - React.js component to connect to your application with logger.</li>
            <li>logger - is a module that has methods: log, info, warn, debug, error. You can put it in your business logic to save it in the actions stack.</li>
        </ol>
        <p>We need to use logger in that tiny place your business logic to provide you more information about what happened!</p>
        <p>After something happened <strong>LogRock</strong> can send it on your Backend or ElasticSearch or save it to file etc.</p>
    </>;
};

export default Approach;