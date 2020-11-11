import React from 'react';
import createDocumentation from '../generator';
import logo from './assets/header-logo.svg';
import Rockpack from './Pages/Rockpack';
import FastSetup from './Pages/Fast-setup';
import LogDrivenDevelopment from './Pages/Log-Driven-Development';
import LocalizationTrueWay from './Pages/Localization-True-Way';
import SSR1Basic from './Pages/SSR-1-Creating-simple-SSR-application';
import SSR2Migration from './Pages/SSR-2-Migration-legacy-app-to-SSR';
import SSR3Advanced from './Pages/SSR-3-Advanced-Techniques';

createDocumentation({
  logo,
  logoAlt: 'Rockpack',
  docgen: [
    Rockpack,
    FastSetup,
    {
      title: 'Articles:',
      menuOnly: true,
    },
    SSR1Basic,
    SSR2Migration,
    SSR3Advanced,
    LogDrivenDevelopment,
    LocalizationTrueWay,
  ],
  title: 'Rockpack',
  github: 'https://github.com/AlexSergey/rockpack',
  footer: <div>License MIT, 2020</div>,
  ga: 'UA-155200418-1',
}, document.getElementById('root'));
