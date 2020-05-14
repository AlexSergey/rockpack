<div align="center">
    <a href="http://www.natrube.net/logrock/index.html">
        <img src="http://www.natrube.net/logrock/LogRock.png" alt="This module can help you build error tracking & crash reporting system" />
    </a>
</div>
<div align="center">
    <a href="http://www.natrube.net/logrock/index.html">Website</a>
</div>

## Table of Contents

- [What is it](#what-is-it)
- [Articles](#articles)
- [Usage](#usage)
- [Props](#props)
- [Browser Compatibility](#browser-compatibility)
- [License](#license)

## What is it?

Our application is alive organism. The bug in your application is a kind of disease. Nobody and nothing than your application can tell you better what went wrong with it.

As developers, we would like to know which actions caused the error, what buttons the user clicked, what device and operation system it was. That and much more information could help us to resolve any problems and fix bugs more effectively.

If our users told us what they do before the bug appears it would be very cool... LogRock can help you with that!

LogRock is React.js component with module which can help you to build error tracking & crash reporting system.

You can tie it with ElasticSearch or other backend to analyze your bugs.

## Articles

More information in my article:

<p>
    English (work in progress)
</p>
<p>
    <a href="https://habr.com/ru/post/453652/">
        Russian
    </a>
</p>

## Usage

1. Installation:

```sh
# NPM
npm install logrock --save

# YARN
yarn add logrock
```

2. ES6 and CommonJS builds are available with each distribution. For example:

```js
import logger, { LoggerContainer, LoggerContext } from 'logrock';
```

3. You need to wrap your app with <LoggerContainer>

```jsx
import React, { useCallback, useContext } from 'react';
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
}
```

4. You need to add the logger to any of the methods you want to cover our logging system.

For example, we have toggle component in React

```jsx
import React, { useState } from "react";

export default function Toggle(props) {
    const [toggleState, setToggleState] = useState("off");
    
    function toggle() {
        setToggleState(toggleState === "off" ? "on" : "off");
    }
    
    return <div className={`switch ${toggleState}`} onClick={toggle} />;
}
```

If you want to cover this code by logger you need to add logger.log to toggle method:

```jsx
import React, { useState } from "react";
import logger from 'logrock';


export default function Toggle(props) {
    const [toggleState, setToggleState] = useState("off");
    
    function toggle() {
        let state = toggleState === "off" ? "on" : "off";
        logger.info(`React.Toggle|Toggle component changed state ${state}`);
        setToggleState(state);
    }
    
    return <div className={`switch ${toggleState}`} onClick={toggle} />;
}
```
## Props

- \<LoggerContainer /> props:

| Prop | Type | Description |
| --- | --- | --- | 
| active | Boolean[true] | Turn on/off logger system. You can turn it off in the test environment. |
| bsodActive | Boolean[true] | Show BSOD when an error occurs in your system. I recommend you to turn it off in production. |
| sessionID | Number | If you want to connect your session with backend actions you can generate SessionID and add it to all your requests. |
| bsod | ReactElement[Component] | Default Blue Screen Of Death component. You can change it to another. |
| limit | Number[25] | Limit for actions that user made. |
| getCurrentDate | Function | Format date function. By default - new Date().toLocaleString() |
| onError | Function | window.onbeforeunload callback. It will be fire when user close the window |
| onPrepareStack | Function | This middleware will be called before you get stack in onError callback. In this callback, you can merge any extra data with your stack. For example, you can merge actual information about localization, theme, something settings etc. |
| stdout | Function | You can output log message to the console or if you set second parameter "true" you can show log to the user use any notifier. See the code in <a href="https://github.com/AlexSergey/logrock/blob/master/example/src/Examples/index.jsx" target="_blank">provided example</a> |

- logger methods:

This is a simple logger. That related to LoggerContainer and it builds your stack.
Each of logger calls and adds the new action to our stack.
```js
logger.log("log text here!");
logger.info("Some extra log information");
logger.warn("Warning! Warning!");
logger.debug("I'm a debug message!");
logger.error("Ups...");
```
If we add second parameter to logger we can call stdout function to show this action to our users.
It will be useful when we need to say our user that there are some errors in our application or successful actions.

## Browser Compatibility

| Browser | Works? |
| :------ | :----- |
| Chrome  | Yes    |
| Firefox | Yes    |
| Safari  | Yes    |
| IE 11   | Yes    |


## License

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
