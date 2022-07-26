import React from 'react';

// eslint-disable-next-line import/extensions
import createDocumentation from '../generator';

import Rockpack from './Pages/Rockpack';
import logo from './assets/header-logo.svg';

createDocumentation(
  {
    docgen: [Rockpack],
    footer: <div>License MIT, {new Date().getFullYear()}</div>,
    ga: 'UA-155200418-1',
    github: 'https://github.com/AlexSergey/rockpack',
    logo,
    logoAlt: 'Rockpack',
    noSidebar: true,
    title: 'Rockpack',
  },
  document.getElementById('root'),
);
