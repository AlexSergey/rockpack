import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeInstallationExample from 'raw-loader!./code/code-isntallation.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeCreateExample from 'raw-loader!./code/code-create.example';
import img from '../../../readme_assets/rockpack_starter_1.v3.jpg';

const Page = () => (
  <div>
    <p>The easiest way to start is using <a href="https://github.com/AlexSergey/rockpack/tree/master/packages/starter">@rockpack/starter</a> module. This module can help you to create the backbone of an
      application. It supports different types of applications:
    </p>

    <ul>
      <li>Simple Single Page application</li>
      <li>Server-Side Render</li>
      <li>Server-Side Render + Redux + Sagas + React-Router + project structure</li>
      <li>UMD library or React Component</li>
    </ul>

    <p>1. Installation:</p>

    <Highlight {...defaultProps} code={codeInstallationExample} language="bash">
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

    <p>2. Creating an App:</p>

    <Highlight {...defaultProps} code={codeCreateExample} language="bash">
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

    <p>3. Select the type of application, select the required modules:</p>

    <img className="flexible-image" src={img} alt="Rockpack CLI" />

    <hr />

    {/* eslint-disable-next-line max-len */}
    <p>You can use Rockpack modularly, just what you need. Or in a Legacy project. These approaches are described below.</p>

    <ul>
      <li>
        <p>Server Side Rendering:</p>
        <p>
          <a href="/ssr-1-creating-simple-ssr-application">Creating simple SSR application [Article]</a>
        </p>
        <p>
          <a href="/ssr-2-migration-legacy-app-to-ssr">Migration legacy application to SSR [Article]</a>
        </p>
      </li>
      <li>
        <p>Finding bugs using logging:</p>
        <p>
          <a href="/log-driven-development">Log Driven Development [Article]</a>
        </p>
      </li>
      <li>
        <p>Application localizing without problems:</p>
        <p>
          <a href="/localization-true-way">Localization. True way [Article]</a>
        </p>
      </li>
    </ul>
  </div>
);

export default {
  title: 'Fast Setup',
  url: '/fast-setup',
  component: Page
};
