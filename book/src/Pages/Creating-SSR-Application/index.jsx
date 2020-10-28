import React from 'react';

const Page = () => (
  <div>SSR</div>
);

const page = {
  title: 'Creating SSR Application',
  url: '/ssr-simple',
  menuOnly: true,
  menuClassName: 'small-menu-item',
  meta: [
    <meta name="description" content="Rockpack ..." />
  ],
  component: Page
};

export default page;
