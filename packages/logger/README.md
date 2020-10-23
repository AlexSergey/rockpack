<p align="center">
  <img src="http://www.natrube.net/logrock/LogRock.png" alt="This module can help you build error tracking & crash reporting system" />
</p>

# @rockpack/logger

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README_RU.md">Readme (Russian version)</a>
</p>

Our application is alive organism. The bug in your application is a kind of disease. Nobody and nothing than your application can tell you better what went wrong with it.

As developers, we would like to know which actions caused the error, what buttons the user clicked, what device and operation system it was. That and much more information could help us to resolve any problems and fix bugs more effectively.

**@rockpack/logger** is a React component and logging system that allows you to record all actions before a critical error occurs so that this information can be analyzed later.

**@rockpack/logger** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

## Using

1. Installation:

```sh
# NPM
npm install @rockpack/logger --save

# YARN
yarn add @rockpack/logger
```

2. For the logger system to work correctly, we need to wrap our application in a *<LoggerContainer>* component

```jsx
import React, { useCallback, useContext } from 'react';
import logger, { LoggerContainer, useLoggerApi, useLogger } from '@rockpack/logger';

const App = () => {
  const { getStackData, triggerError } = useLoggerApi();
  ...
}

export default function () {
  const loggerCtx = useContext(LoggerContext);
  const showMessage = useCallback((level, message, important) => {
    alert(message);
  });

  return <LoggerContainer
    sessionID={window.sessionID}
    limit={75} // Stack length limit. On overflow, the first element will be removed
    getCurrentDate={() => {
      // Critical error date
      return dayjs()
        .format('YYYY-MM-DD HH:mm:ss');
    }}
    stdout={showMessage} // Display some errors as a tooltip for users
    onError={stackData => {
      // Send a stack of actions before the error to the backend (or otherwise process it)
      sendToServer(stack);
    }}
    onPrepareStack={stack => {
      // Allows you to add additional information to the stack
      stack.language = window.navigator.language;
    }}>
    <App/>
  </LoggerContainer>
}
```

4. You need to add the logger to any of the methods you want to cover our logging system.

The **@rockpack/logger** module comes with a logger that is linked to *<LoggerContainer />*

Suppose we have a component

```jsx
import React, { useState } from 'react';

export default function Toggle(props) {
  const [toggleState, setToggleState] = useState('off');

  function toggle() {
    setToggleState(toggleState === 'off' ? 'on' : 'off');
  }

  return <div className={`switch ${toggleState}`} onClick={toggle}/>;
}
```

To properly log it, we need to modify the toggle method

```jsx
import React, { useState } from 'react';
import logger from '@rockpack/logger';

export default function Toggle(props) {
  const [toggleState, setToggleState] = useState('off');

  function toggle() {
    let state = toggleState === 'off' ? 'on' : 'off';
    logger.info(`React.Toggle|Toggle component changed state ${state}`);
    setToggleState(state);
  }

  return <div className={`switch ${toggleState}`} onClick={toggle}/>;
}
```

We have added a logger in which the information is divided into 2 parts. React.Toggle shows us that this action happened at the level of React, the Toggle component, and then we have a verbal explanation of the action and the current state that came to this component.

If a critical error occurs in the system, we will have a **BSOD** with a detailed description of the user's actions. It will also be possible to send this stack to the error analysis system or ElasticSearch in order to quickly catch errors that occurred among our users.

<p align="right">
  <img alt="BSOD" src="https://www.rockpack.io/readme_assets/rockpack_logger_bsod.jpg" />
</p>

*- When logging applications, you need to put logs in the most confusing and complex parts of the code, so you will understand what happened at this stage.*

*- We can also use the “componentDidCatch” method, which was introduced in React 16, in case an error occurs.*

## Properties

- \<LoggerContainer /> properties:

| Prop | Type | Description |
| --- | --- | --- |
| active | Boolean[true] | Enable / disable logging. It is recommended to disable logging during the testing phase. |
| bsodActive | Boolean[true] | Enable / disable BSOD output. It is recommended to disable for Production  |
| sessionID | Number | If you need to associate logging with Backend calls - a single session for Frontend and Backend will allow you to do this |
| bsod | ReactElement[Component] | You can set your BSOD Component |
| limit | Number[25] | Stack length limit. On overflow, the first element will be removed |
| getCurrentDate | Function | Date format when an error occurred. Default - new Date().toLocaleString() |
| onError | Function | window.onbeforeunload callback. In this callback, you can handle the stack or send it to the Backend |
| onPrepareStack | Function | Allows you to add additional information to the stack before calling onError. For example, you can add the current localization of the application, the theme selected by the user, the name of the user who got the error, etc. |
| stdout | Function | This method allows you to display the log method for the user (which was called with the second parameter "true"). For example, calling logger.error ('Ups ...', true) in the stdout method would output alert (message); |

- logger methods:

The logger provided with **@rockpack/logger** has methods:

```js
logger.log('log text here!');
logger.info('Some extra log information');
logger.warn('Warning! Warning!');
logger.debug('I\'m a debug message!');
logger.error('Ups...');
```

If we add *true* as the second parameter, the message passed to this log method will be passed to stdout *<LoggerContainer>*. This will display some useful messages for the user, for example, in tooltip or alert.

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
