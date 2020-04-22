import React from 'react';
import Code from '../components/Code';

const Approach = () => {
    return <>
        <h3>Usage</h3>
        <p><strong>1. Installation:</strong></p>
        <code>
            # NPM<br />
            npm install react-sortable-tree --save<br />
            <br />
            # YARN<br />
            yarn add react-sortable-tree<br />
        </code>
        <br/>
        <p><strong>2. ES6 and CommonJS builds are available with each distribution. For example:</strong></p>
        <Code height={'18px'} value={`import logger, { LoggerContainer, LoggerContext } from 'logrock'`} />
        <p><strong>3. You need to wrap your app with {`<LoggerContainer>`}</strong></p>
        <Code height={'465px'} width={'100%'} value={`import React, { useCallback, useContext } from 'react';
import { LoggerContainer, LoggerContext } from 'logrock';

export default function() {
    const loggerCtx = useContext(LoggerContext);
    const showMessage = useCallback((level, message, important) => {
        alert(message);
    });

    return <LoggerContainer
           sessionID={window.sessionID}
           limit={75} // stack limit. After overflowing the first item will be remove
           getCurrentDate={() => {
                // You can replace default date to another format
                return dayjs().format('YYYY-MM-DD HH:mm:ss');
           }}
           stdout={showMessage} // show logs for your users
           onError={stackData => {
               // Send stack on your Backend or ElasticSearch or save it to file etc.
               sendToServer(stack);
           }}
           onPrepareStack={stack => {
               // This is middleware
               // Add extra data to stack before it will call onError
               stack.language = window.navigator.language;
           }}>
               <App />
       </LoggerContainer>
}`} />
        <p><strong>4. You need to add the logger to any of the methods you want to cover our logging system.</strong></p>
        <p>For example, we have toggle component in React</p>
        <Code height={'190px'} width={'100%'} value={`import React, { useState } from "react";

export default function Toggle(props) {
    const [toggleState, setToggleState] = useState("off");

    function toggle() {
        setToggleState(toggleState === "off" ? "on" : "off");
    }

    return <div className={\`switch \${toggleState}\`} onClick={toggle} />;
}`} />
        <p>If you want to cover this code by logger you need to add logger.log to toggle method:</p>
        <Code height={'220px'} width={'100%'} value={`import React, { useState } from "react";

export default function Toggle(props) {
    const [toggleState, setToggleState] = useState("off");

    function toggle() {
        let state = toggleState === "off" ? "on" : "off";
        logger.info(\`React.Toggle|Toggle component changed state \${state}\`);
        setToggleState(state);
    }

    return <div className={\`switch \${toggleState}\`} onClick={toggle} />;
}`} />
    </>;
};

export default Approach;
