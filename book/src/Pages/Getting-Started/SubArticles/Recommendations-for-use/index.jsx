import React from 'react';

const Page = () => (
  <div>
    <ul>
      <li>
        {/* eslint-disable-next-line max-len */}
        <strong>Beginners.</strong> With the help of Rockpack, any newbie to React can deploy a project of any complexity in a few
        minutes, with configured webpack, eslint, jest, etc. Applications can be either regular Single Page or with a
        project structure, Server Side Render, etc.
      </li>
      <li>
        {/* eslint-disable-next-line max-len */}
        <strong>Large projects from scratch.</strong> Rockpack supports most of the webpack best practices configurations, eslint rules, jest, typescript and will
        work great even on large projects
      </li>
      <li>
        {/* eslint-disable-next-line max-len */}
        <strong>Startup.</strong> If you need to quickly check an idea without wasting time on unfolding and setting up the project.
      </li>
      <li>
        {/* eslint-disable-next-line max-len */}
        <strong>Library or React component.</strong> If you want to write a UMD library or React component, with support for the esm /
        cjs build as well as the minified version.
      </li>
      <li>
        {/* eslint-disable-next-line max-len */}
        Rockpack is suitable for <strong>legacy projects</strong>. Rockpack is a modular platform, you can only use what you need. For
        example: transfer your application to Server Side Render, add logging, localization, etc.
      </li>
    </ul>
  </div>
);

export default {
  title: 'Recommendations for use',
  name: 'recommendations-for-use',
  component: Page
};
