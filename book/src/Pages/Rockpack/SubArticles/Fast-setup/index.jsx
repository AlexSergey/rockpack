import React from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeInstallationExample from 'raw-loader!./code/code-isntallation.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeCreateExample from 'raw-loader!./code/code-create.example';
import Code from '../../../../components/Code';
import img from '../../../../../readme_assets/rockpack_starter_1.v4.jpg';

const Page = () => (
  <div>
    <p>The easiest way to start is using <a href="https://github.com/AlexSergey/rockpack/tree/master/packages/starter">@rockpack/starter</a> module. This module can help you to create the backbone of an
      application. It supports different types of applications:
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

    <img className="flexible-image" src={img} alt="Rockpack CLI" />
  </div>
);

export default {
  title: 'Fast Setup',
  component: Page
};
