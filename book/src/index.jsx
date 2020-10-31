import React from 'react';
import createDocumentation from '../generator';
import logo from './assets/header-logo.svg';
import GettingStarted from './Pages/Getting-Started';
import LogDrivenDevelopment from './Pages/Log-Driven-Development';
import LocalizationTrueWay from './Pages/Localization-True-Way';
import SSR1Basic from './Pages/SSR-1-basics-сreating-simple-application';
import SSR2Migration from './Pages/SSR-2-Migration-legacy-redux-to-SSR';

createDocumentation({
  logo,
  logoAlt: 'Rockpack',
  docgen: [
    GettingStarted,
    {
      title: 'Articles:',
      menuOnly: true,
    },
    SSR1Basic,
    SSR2Migration,
    LogDrivenDevelopment,
    LocalizationTrueWay,
  ],
  title: 'Rockpack',
  github: 'https://github.com/AlexSergey/rockpack',
  footer: <div>License MIT, 2020</div>,
  ga: 'UA-155200418-1',
}, document.getElementById('root'));
