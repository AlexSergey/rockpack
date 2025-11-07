import { ReactElement, useEffect } from 'react';
import ReactGA from 'react-ga4';

import img from '../readme_assets/rockpack_starter_1.v6.png';
import Github from './assets/github.component.svg';
import LogoComponent from './assets/logo.component.svg';
import * as styles from './assets/styles/page.module.scss';
import { Code } from './code';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import codeCreateExample from './code-samples/create.example';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import codeInstallationExample from './code-samples/installation.example';

ReactGA.initialize('UA-155200418-1');

export const Page = (): ReactElement => {
  const hash = window?.location?.hash;

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash);

      if (element) {
        element.scrollIntoView({ behavior: 'instant' });
      }
    }
  }, [hash]);

  return (
    <div className={styles.page}>
      <div>
        <LogoComponent />
        <a className={styles.github} href="https://github.com/AlexSergey/rockpack" rel="noreferrer" target="_blank">
          <Github />
        </a>
        <p>
          <strong>Rockpack</strong> is a lightweight, zero-configuration solution for quickly setting up a React
          application with full support for <strong>Server-Side Rendering (SSR)</strong>, bundling, linting, and
          testing. In just 5 minutes, you can get up and running with a modern React app that&#39;s optimized for
          performance and best practices. Perfect for developers who want to skip the setup and focus on building their
          app!
        </p>
        <ul>
          <li>
            <strong>Instant SSR</strong>: Seamlessly integrate server-side rendering for better SEO and faster initial
            page loads.
          </li>
          <li>
            <strong>Smart Bundling</strong>: Out-of-the-box support for bundling with optimal performance.
          </li>
          <li>
            <strong>Automatic Linting</strong>: Maintain code quality with built-in linting and style checks.
          </li>
          <li>
            <strong>Ready for Testing</strong>: Pre-configured testing environment with popular tools like Jest.
          </li>
        </ul>
        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Zero-config setup</strong>: Start building immediately with minimal setup.
          </li>
          <li>
            <strong>React, SSR, and Webpack integration</strong>: All in one package for efficient development.
          </li>
          <li>
            <strong>Optimized for production</strong>: Bundle, lint, test, and render with best practices.
          </li>
          <li>
            <strong>Extensible</strong>: Easily customize for more advanced use cases.
          </li>
        </ul>
        <p>
          Get started with <strong>Rockpack</strong> today and streamline your React app development!
        </p>
      </div>
      <h2 id="#getting_started">Getting Started</h2>
      <p>
        The easiest way to start is using{' '}
        <a href="https://github.com/AlexSergey/rockpack/tree/master/packages/starter">@rockpack/starter</a> module. This
        module can help you to create the backbone of an application. It supports different types of applications:
      </p>

      <ul>
        <li>Simple Single Page application</li>
        <li>Server-Side Render</li>
        <li>Pure React project</li>
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
};
