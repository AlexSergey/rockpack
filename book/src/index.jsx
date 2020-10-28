import React from 'react';
import createDocumentation from '../generator';
import logo from './assets/header-logo.svg';
import GettingStarted from './Pages/Getting-Started';
import CreatingSSRApplication from './Pages/Creating-SSR-Application';

createDocumentation({
  logo,
  logoAlt: 'Rockpack',
  docgen: [
    GettingStarted,
    {
      title: 'Articles:',
      menuOnly: true,
    },
    CreatingSSRApplication
  ],
  title: 'Rockpack',
  github: 'https://github.com/AlexSergey/rockpack',
  footer: <div>License MIT, 2020</div>,
  ga: 'UA-155200418-1',
}, document.getElementById('root'));
