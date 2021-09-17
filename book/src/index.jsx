import React from 'react';
import createDocumentation from '../generator';
import logo from './assets/header-logo.svg';
import Rockpack from './Pages/Rockpack';

createDocumentation({
  logo,
  logoAlt: 'Rockpack',
  noSidebar: true,
  docgen: [
    Rockpack,
  ],
  title: 'Rockpack',
  github: 'https://github.com/AlexSergey/rockpack',
  footer: <div>License MIT, 2020</div>,
  ga: 'UA-155200418-1',
}, document.getElementById('root'));
