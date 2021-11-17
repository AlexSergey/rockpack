import React from 'react';
import children from './SubArticles';

const page = {
  title: 'Rockpack',
  url: window.location.pathname.includes('rockpack') ? '/rockpack' : '/',
  menuOnly: true,
  meta: [
    <meta name="description" content="Rockpack is a simple solution for creating React Application with Server Side Rendering, bundling, linting, testing within 5 minutes" key="description" />
  ],
  children
};

export default page;
