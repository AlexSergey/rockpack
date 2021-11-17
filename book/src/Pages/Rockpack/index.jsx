import React from 'react';
import children from './SubArticles';

const page = {
  title: 'Rockpack',
  url: window.location.pathname.includes('rockpack') ? '/rockpack/' : '/',
  menuOnly: true,
  meta: [
    <meta name="description" content="Rockpack ..." key="description" />
  ],
  children
};

export default page;
