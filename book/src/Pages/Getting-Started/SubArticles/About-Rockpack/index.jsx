import React from 'react';
import LogoComponent from './assets/logo.component.svg';

const Page = () => (
  <div>
    <LogoComponent />
    <p>Rockpack allows you to create a React project with a perfectly configured webpack, eslint, jest, and such. You
      get a project with Server-Side Render support, CSS (SCSS, LESS) Modules, @loadable, SVG as React Component,
      Typescript or Babel, support for many file formats, performance optimizations, and so on.
    </p>
    <p>The main goal is to reduce project setup time from weeks to 5 minutes.</p>
  </div>
);

export default {
  title: 'About Rockpack',
  name: 'about-rockpack',
  menuOnly: true,
  component: Page
};
