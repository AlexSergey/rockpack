import { ReactElement } from 'react';
import ReactGA from 'react-ga';

import img from '../readme_assets/rockpack_starter_1.v5.png';
import Github from './assets/github.component.svg';
import LogoComponent from './assets/logo.component.svg';
import styles from './assets/styles/page.module.scss';
import { Code } from './code';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import codeCreateExample from './code-samples/create.example';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import codeInstallationExample from './code-samples/installation.example';

ReactGA.initialize('UA-155200418-1');
ReactGA.pageview(window.location.pathname + window.location.search);

export const Page = (): ReactElement => (
  <div className={styles.page}>
    <div>
      <LogoComponent />
      <a className={styles.github} href="https://github.com/AlexSergey/rockpack" rel="noreferrer" target="_blank">
        <Github />
      </a>
      <p>
        <strong>Rockpack</strong> is a simple solution for creating React Application with Server Side Rendering,
        bundling, linting, testing, logging, localizing.
      </p>
      <p>The main goal is to reduce project setup time from weeks to 5 minutes.</p>
    </div>

    <p>
      The easiest way to start is using{' '}
      <a href="https://github.com/AlexSergey/rockpack/tree/master/packages/starter">@rockpack/starter</a> module. This
      module can help you to create the backbone of an application. It supports different types of applications:
    </p>

    <ul>
      <li>Simple Single Page application</li>
      <li>Server-Side Render</li>
      <li>Server-Side Render + Redux + Thunk + React-Router + project structure</li>
      <li>UMD library or React Component</li>
    </ul>

    <p>1. Installation:</p>

    <Code code={codeInstallationExample} language="bash" />

    <p>2. Creating an App:</p>

    <Code code={codeCreateExample} language="bash" />

    <p>3. Select the type of application, select the required modules:</p>

    <img alt="Rockpack CLI" className="flexible-image" src={img} style={{ width: '100%' }} />

    <div>License MIT, {new Date().getFullYear()}</div>
  </div>
);
