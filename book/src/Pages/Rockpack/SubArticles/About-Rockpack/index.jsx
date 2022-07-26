import React from 'react';

import LogoComponent from './assets/logo.component.svg';

const Page = () => (
  <div>
    <LogoComponent />
    <p>
      <strong>Rockpack</strong> is a simple solution for creating React Application with Server Side Rendering,
      bundling, linting, testing, logging, localizing.
    </p>
    <p>The main goal is to reduce project setup time from weeks to 5 minutes.</p>
  </div>
);

export default {
  component: Page,
  menuOnly: true,
  name: 'about-rockpack',
  title: 'About Rockpack',
};
