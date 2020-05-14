import React from 'react';
import Code from '../components/Code';
import dayjs from "../Examples";
import {LoggerContainer} from "../../../src";

const LoggerContainerProps = () => {
    return <>
        <p style={{fontSize: '17px'}}><strong>{"<LoggerContainer />"}</strong> props:</p>
        <table className="table">
            <tbody>
                <tr>
                    <th>
                        active
                    </th>
                    <td>
                        Boolean[true]
                    </td>
                    <td>
                        Turn on/off logger system. You can turn it off in the test environment.
                    </td>
                </tr>
                <tr>
                    <th>
                        bsodActive
                    </th>
                    <td>
                        Boolean[true]
                    </td>
                    <td>
                        Show BSOD when an error occurs in your system. I recommend you to turn it off in production.
                    </td>
                </tr>
                <tr>
                    <th>
                        sessionID
                    </th>
                    <td>
                        Number
                    </td>
                    <td>
                        If you want to connect your session with backend actions you can generate SessionID and add it to all your requests.
                    </td>
                </tr>
                <tr>
                    <th>
                        bsod
                    </th>
                    <td>
                        Component
                    </td>
                    <td>
                        Default Blue Screen Of Death component. You can change it to another.
                    </td>
                </tr>
                <tr>
                    <th>
                        limit
                    </th>
                    <td>
                        Number[25]
                    </td>
                    <td>
                        Limit for actions that user made.
                    </td>
                </tr>
                <tr>
                    <th>
                        getCurrentDate
                    </th>
                    <td>
                        Function
                    </td>
                    <td>
                        Format date function. By default - new Date().toLocaleString()
                    </td>
                </tr>
                <tr>
                    <th>
                        onError
                    </th>
                    <td>
                        Function
                    </td>
                    <td>
                        window.onerror callback. If an error happens it will call with all stack data. You can send it to ElasticSearch or Backend or save it to file for analyzing and understanding user's actions.
                    </td>
                </tr>
                <tr>
                    <th>
                        onPrepareStack
                    </th>
                    <td>
                        Function
                    </td>
                    <td>
                        This middleware will be called before you get stack in onError callback. In this callback, you can merge any extra data with your stack. For example, you can merge actual information about localization, theme, something settings etc.
                    </td>
                </tr>
                <tr>
                    <th>
                        stdout
                    </th>
                    <td>
                        Function
                    </td>
                    <td>
                        <p>You can output log message to the console, or if you set second parameter "true" you can show log to the user use any notifier.</p>
                        <p>For example:</p>
                        <Code height={'18px'} value={`logger.log('Show it for user!', true); `} />
                        <p>stdout method:</p>
                        <Code height={'165px'} value={`<LoggerContainer
    stdout={(level, message, important) => {
        console[level](message);

        if (important) {
            alert(message);
        }
    }}>
        <App />
</LoggerContainer>`} />
                        See the code in <a href="https://github.com/AlexSergey/logrock/blob/master/example/src/Examples/index.jsx" target="_blank">provided example</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </>;
};

const LoggerMetods = () => {
    return <>
        <p style={{fontSize: '17px'}}><strong>{"logger"}</strong> methods:</p>
        <p>This is a simple logger. That related to LoggerContainer and it builds your stack.</p>
        <p>Each of logger calls and adds the new action to our stack.</p>
        <Code height={'85px'} value={`logger.log("log text here!");
logger.info("Some extra log information");
logger.warn("Warning! Warning!");
logger.debug("I'm a debug message!");
logger.error("Ups...");`} />
        <p>If we add second parameter to logger we can call stdout function to show this action to our users.</p>
        <p>It will be useful when we need to say our user that there are some errors in our application or successful actions.</p>
    </>;
};

const Props = () => {
    return <>
        <h3>Props</h3>
        <LoggerContainerProps />
        <LoggerMetods />
    </>;
};

export default Props;