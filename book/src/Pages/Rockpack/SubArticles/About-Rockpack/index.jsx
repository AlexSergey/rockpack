import React from 'react';
import LogoComponent from './assets/logo.component.svg';

const Page = () => (
  <div>
    <LogoComponent />
    <p>
      <strong>Rockpack</strong> is a solution for creating React Application with Server Side Rendering,
      bundling, linting, testing, logging, localizing.
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
