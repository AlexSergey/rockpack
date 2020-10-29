import React from 'react';
import createDocumentation from '../generator';
import logo from './assets/header-logo.svg';
import GettingStarted from './Pages/Getting-Started';
// eslint-disable-next-line no-unused-vars
import CreatingSSRApplication from './Pages/Creating-SSR-Application';
import LogDrivenDevelopment from './Pages/Log-Driven-Development';
// eslint-disable-next-line no-unused-vars
import LocalizationTrueWay from './Pages/Localization-True-Way';

createDocumentation({
  logo,
  logoAlt: 'Rockpack',
  docgen: [
    GettingStarted,
    {
      title: 'Articles:',
      menuOnly: true,
    },
    LogDrivenDevelopment,
    LocalizationTrueWay,
    //CreatingSSRApplication
  ],
  title: 'Rockpack',
  github: 'https://github.com/AlexSergey/rockpack',
  footer: <div>License MIT, 2020</div>,
  ga: 'UA-155200418-1',
}, document.getElementById('root'));
