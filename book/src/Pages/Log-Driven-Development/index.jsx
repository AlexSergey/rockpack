import React from 'react';
import dracula from 'prism-react-renderer/themes/dracula';
import Highlight, { defaultProps } from 'prism-react-renderer';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeInstallSample from 'raw-loader!./code/code-install.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeWrapContainerSample from 'raw-loader!./code/code-wrap-container.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeWrapContainerSettingsSample from 'raw-loader!./code/code-wrap-container-settings.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeComponentSample from 'raw-loader!./code/code-component.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeToggleSample from 'raw-loader!./code/code-toggle.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeSessionID from 'raw-loader!./code/code-session-id.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeFetch from 'raw-loader!./code/code-fetch.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeLoggerContainerSessionID from 'raw-loader!./code/code-loggerContainer-session-id.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeRequestSample from 'raw-loader!./code/code-request.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeBSODSample from 'raw-loader!./code/code-bsod-container.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeHookExample from 'raw-loader!./code/code-hook.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeStdoutExample from 'raw-loader!./code/code-stdout.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeLoggerImportantExample from 'raw-loader!./code/code-logger-important.example';
import img1 from './assets/img-1.png';
import img2 from './assets/img-2.png';
import img3 from './assets/img-3.png';
import img4 from './assets/img-4.png';
import bsod from '../../../readme_assets/rockpack_logger_bsod.jpg';

const Page = () => (
  <div>
    <p>
      The <a href="https://github.com/AlexSergey/logrock">logrock</a> module was born when we started working on the <a href="https://www.cleverbrush.com/">Cleverbrush</a> product. This is a software for working with
      vector graphics. Working with a graphics editor implies a huge number of application use cases. We are trying to
      save money and time, so we optimize everything, including testing. Covering each option with test cases is too
      expensive and irrational, especially since it is impossible to cover all options.
    </p>

    <p>
      This module can organize modern logging for your application. Basing on the logs we test our application. In this
      article I am going to tell you about how you can organize your logging system for searching bugs.
    </p>

    <h3>What is the problem?</h3>

    <p>
      If we compare application with alive organism that bug is a disease. The cause of this "disease" can be a number
      of factors, including the environment of a particular user. This is really relevant when we are talking about web
      platform. Sometimes reason is very complicated and bug that was found through testing - the result of a number
      of actions.
    </p>

    <p>
      As with human illnesses, no one can explain their symptoms better than a patient, any tester can tell what
      happened, better than the program itself.
    </p>

    <h3>What to do?</h3>

    <p>
      To understand what is happening, we need a history of actions that the user performed in our application.
    </p>

    <p>
      In order for our program to tell us that it hurts, we will take the <a href="https://github.com/AlexSergey/logrock">logrock</a> module and link it to ElasticSearch,
      LogStash and Kibana for further analysis.
    </p>

    <img className="flexible-image" src={img1} alt="Elastic Stack" />

    <ul>
      <li><strong>ElasticSearch</strong> is a powerful full-text search engine.</li>
      {/* eslint-disable-next-line max-len */}
      <li><strong>LogStash</strong> is a system for collecting logs from various sources that can send logs to ElasticSearch as well.</li>
      <li><strong>Kibana</strong> is a web interface for ElasticSearch with many additions.</li>
    </ul>

    <h3>How does it work?</h3>

    <img className="flexible-image" src={img2} alt="App logging system" />

    <p>
      In case of an error (or just on demand), the application sends logs to the server where they are saved to a file.
      Logstash incrementally saves data to ElasticSearch - to the database. The user logs in Kibana and sees the saved
      logs.
    </p>

    <img className="flexible-image" src={img3} alt="Kibana" />

    <p>
      Above you see a well set up Kibana. It displays your data from ElasticSearch. That can help you to analyze your
      data and understand what happened.
    </p>

    <p>
      <strong>In this article I am <strong>NOT</strong> considering setup ElasticStack!</strong>
    </p>

    <h3>Creating logging system</h3>

    <p>For example, we are going to integrate logging system to single page application based on React.</p>

    <p>1. Installation:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeInstallSample} language="bash">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>2. We need to wrap up the application with a component</p>

    <Highlight {...defaultProps} theme={dracula} code={codeWrapContainerSample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>
      LoggerContainer is a component that reacts to errors in your application and forms a stack.
    </p>

    <p>
      A stack is an object with information about the user's operating system, browser, which mouse or keyboard button
      was pressed and, of course, the actions subarray, where all the user actions that he performed in our system are
      recorded.
    </p>

    <p>
      LoggerContainer has settings, consider some of them
    </p>

    <Highlight {...defaultProps} theme={dracula} code={codeWrapContainerSettingsSample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <ul>
      <li>
        <strong>active</strong> - enables or disables the logger.
      </li>
      <li>
        <strong>limit</strong> - sets a limit on the number of recent actions saved by the user. If the user performs
        21 actions, then the first one in this array will be automatically deleted. Thus, we
        will have the last 20 actions that preceded the error.
      </li>
      <li>
        {/* eslint-disable-next-line max-len */}
        <strong>onError</strong> is a callback that is called when an error occurs. The Stack object comes to it, in which all
        information about the environment, user actions, etc. is stored. It is from this callback that we need to send
        this data to ElasticSearch or backend, or save it to a file for further analysis and monitoring.
      </li>
    </ul>

    <h3>Logging</h3>

    <p>
      In order to produce high-quality logging of user actions, we will have to cover our code with log calls.
    </p>

    <p>
      The <a href="https://github.com/AlexSergey/logrock">logrock</a> module comes with a logger that is linked to the LoggerContainer
    </p>

    <p>For instance, we have a component</p>

    <Highlight {...defaultProps} theme={dracula} code={codeComponentSample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>
      In order to correctly cover it with a log, we need to modify the toggle method
    </p>

    <Highlight {...defaultProps} theme={dracula} code={codeToggleSample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>
      We have added a logger in which the information is divided into 2 parts. React.Toggle shows us that this action
      happened at the level of React, the Toggle component, and then we have a verbal explanation of the action and the
      current state that came to this component. This division into levels is not necessary, but with this approach it
      will be clearer where exactly our code was executed.
    </p>

    <p>
      We can also use the "componentDidCatch" method, which was introduced in React 16, in case an error occurs.
    </p>

    <h3>Interaction with the server</h3>

    <p>Consider the following example.</p>

    <p>
      Let's say we have a method that collects user data from the backend. The method is asynchronous, part of the logic
      is hidden in the backend. How to properly log this code?
    </p>

    <p>
      Firstly, since we have a client application, all requests going to the server will pass within one user session,
      without reloading the page. In order to associate actions on the client with actions on the server, we must create
      a global SessionID and add it to the header for each request to the server. On the server, we can use any logger
      that will cover our logic like the example from the frontend, and if an error occurs, send this data with the
      attached sessionID to Elastic, to the Backend plate.
    </p>

    <p>1. Generating SessionID on the client</p>

    <Highlight {...defaultProps} theme={dracula} code={codeSessionID} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>
      2. We need to set the SessionID for all requests to the server. If we use libraries for requests, it is very easy
      to do this by declaring a SessionID for all requests.
    </p>

    <Highlight {...defaultProps} theme={dracula} code={codeFetch} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>3. The LoggerContainer has a special field for SessionID</p>

    <Highlight {...defaultProps} theme={dracula} code={codeLoggerContainerSessionID} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>4. The request (on the client) will look like this:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeRequestSample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>4. The request (on the client) will look like this:</p>

    <p>How it works:</p>

    <p>
      We write a log, before the request on the client. From our code, we can see that the download of data from the
      server will start now. We have attached the SessionID to the request. If our backend logs are covered with the
      addition of this SessionID and the request fails, then we can see what happened on the backend.
    </p>

    <p>
      Thus, we monitor the entire cycle of our application, not only on the client, but also on the server.
    </p>

    <h3>QA Engineer</h3>

    <p>Working with a QA engineer deserves a separate description of the process.</p>

    <p>As we are a startup, we have no formal requirements and sometimes not everything is logical.</p>

    <p>
      If the tester does not understand the behavior, this is a case that at least needs to be considered. Also, often,
      a tester simply cannot repeat the same situation twice. Since the steps leading to the incorrect behavior can be
      numerous and non-trivial. In addition, not all errors lead to critical consequences such as Exception. Some of
      them can only change the behavior of the application, but not be interpreted by the system as an error. For these
      purposes, at staging, you can add a button in the application header to force the sending of logs. The tester sees
      that something is wrong, clicks on the button and sends a Stack with actions to ElasticSearch.
    </p>

    <img className="flexible-image" src={img4} alt="BSOD button" />

    <p>
      In case, a critical error has occurred, we must block the interface so that the tester does not click
      further and get stuck.
    </p>

    <p>For these purposes, we display the blue screen of death.</p>

    <img className="flexible-image" src={bsod} alt="BSOD" />

    <p>
      We see above the text with the Stack of this critical error, and below - the actions that preceded it. We also get
      the error ID, the tester just needs to select it and attach it to the ticket. Later this error can be easily found
      in Kibana by this ID.
    </p>

    <p>For these purposes, the LoggerContainer has properties</p>

    <Highlight {...defaultProps} theme={dracula} code={codeBSODSample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <ul>
      <li><strong>bsodActive</strong> – enables / disables BSOD (disabling BSOD applies to production code)</li>
      <li><strong>bsod </strong> – React component. By default, it looks like the above screenshot.</li>
    </ul>

    <p>To display the button in the UI LoggerContainer, we can use the hook:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeHookExample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <h3>User interaction</h3>

    <p>Some logs are useful to the user. To output the user need to use the stdout method:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeStdoutExample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p><strong>stdout</strong> is the method that is responsible for printing messages.</p>

    <p>
      In order for the message to become "important" it is enough to pass true to the logger as the second parameter.
      Thus, we can display this message to the user in a pop-up window, for example, if the data loading has failed, we
      can display an error message.
    </p>

    <Highlight {...defaultProps} theme={dracula} code={codeLoggerImportantExample} language="jsx">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <h3>Tips and tricks</h3>

    <p>Log applications, including in production, because no tester will find bottlenecks better than real users.</p>

    <p>Do not forget to mention the collection of logs in the license agreement.</p>

    <p><strong>DO NOT log passwords, banking details and other personal information!</strong></p>

    <p>Redundancy of logs is also bad, make messages as clear as possible.</p>

    <h3>Conclusion</h3>

    <p>
      When you release an app, life is just beginning for it. Be responsible for your product, get feedback, monitor
      logs and improve it.
    </p>
  </div>
);

const page = {
  title: 'Log Driven Development',
  url: '/log-driven-development',
  menuClassName: 'small-menu-item',
  meta: [
    <meta name="description" content="Rockpack ..." />
  ],
  share: true,
  component: Page
};

export default page;
