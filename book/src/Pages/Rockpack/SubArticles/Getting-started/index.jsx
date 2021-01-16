import React from 'react';
import LearnMore from '../../../../components/LearnMore';

const Page = () => (
  <div>
    <ul>
      <li>
        {/* eslint-disable-next-line max-len */}
        <p>
          <strong>Beginners.</strong> With the help of Rockpack, any newbie to React can deploy a project of any
          complexity in a few
          minutes, with configured webpack, eslint, jest, etc. Applications can be either
          regular Single Page or with a
          project structure, Server Side Render, etc.
        </p>
      </li>
      <li>
        <p>
          {/* eslint-disable-next-line max-len */}
          <strong>Large projects from scratch.</strong> Rockpack supports most of the webpack best practices configurations, eslint rules, jest, typescript and will
          work great even on large projects
        </p>
      </li>
      <li>
        <p>
          {/* eslint-disable-next-line max-len */}
          <strong>Startup.</strong> If you need to quickly check an idea without wasting time on unfolding and setting up the project.
        </p>
      </li>
      <li>
        <p>
          {/* eslint-disable-next-line max-len */}
          <strong>Library or React component.</strong> If you want to write a UMD library or React component, with support for the esm/cjs
          build as well as the minified version.
        </p>
      </li>
    </ul>
    <p><LearnMore url="/fast-setup" /></p>
    <br />
    <ul>
      <li>
        <p>
          {/* eslint-disable-next-line max-len */}
          <strong>Legacy projects or modular use.</strong> Rockpack is a modular platform, you can only use what you need. Please, read articles to learn more:
        </p>
        <ul>
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
      </li>
    </ul>
  </div>
);

export default {
  title: 'Getting Started',
  name: 'getting-started',
  component: Page
};
