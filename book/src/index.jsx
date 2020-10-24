/* eslint-disable */
import React from 'react';
import Localization, { l } from '@rockpack/localazer';
import FlagIconFactory from 'react-flag-icon-css';
import createDocumentation from '../generator';
import ComponentReadme from './readme.mdx';
import image from './T1H4XT8DV-UQ1GA2RSQ-bac8dd448345-512.jpeg';

const FlagIcon = FlagIconFactory(React, { useCssModules: false });
/*
createDocumentation({
  title: 'Abc',
  docgen: [
    {
      title: <Localization>{l('Hello')}</Localization>,
      url: '/',
    },
    {
      title: 'About',
      url: '/about',
      meta: [
        <meta name="description" content="Описание страницы сайта." />
      ]
    },
    {
      title: 'First steps',
      url: '/first-steps',
    },
    {
      title: 'Readme',
      url: '/readme',
    },
    {
      title: 'Installation',
      url: '/install',
    },
    {
      title: 'Components',
      url: '/components',
      component: <div>Crazy components!</div>,
      children: [
        {
          title: 'Button component',
          name: 'button',
          component: ComponentReadme
        },
        {
          title: 'Simple component',
          name: 'simple',
          component: <div>Simple</div>
        }
      ]
    },
    {
      title: 'Uninstall',
      url: '/uninstall',
    },
    {
      title: 'Shortcuts',
      url: '/shortcuts',
    },
    {
      title: 'Articles',
      url: '/articles',
    },
    {
      title: 'Advanced',
      url: '/advanced',
    }
  ],
  logo: image,
  logoAlt: 'Sergey',
  components: {
    h1: props => <h1 style={{ color: 'blue' }} {...props} />
  },
  localization: {
    ru: {
      component: <FlagIcon code="ru" />,
      language: {
        locale_data: {
          messages: {
            '': {
              domain: 'messages',
              lang: 'ru',
              plural_forms: 'nplurals=2; plural=(n != 1);'
            },
            Hello: [
              'Это тест'
            ],
            Hello2: [
              'Это супер тест'
            ]
          }
        }
      }
    },
    en: {
      component: <FlagIcon code="us" />,
      language: {
        locale_data: {
          messages: {
            '': {
              domain: 'messages',
              lang: 'us',
              plural_forms: 'nplurals=2; plural=(n != 1);'
            },
            Hello: [
              'This is test'
            ],
            Hello2: [
              'This is super test'
            ]
          }
        }
      }
    }
  },
  github: 'https://github.com/AlexSergey/rockpack',
  footer: <div>License MIT, 2020</div>,
  ga: 'UA-155200418-1',
}, document.getElementById('root'));
*/
createDocumentation({
  docgen: [
    {
      title: '',
      url: '/',
      component: () => (
        <h2 style={{textAlign: 'center'}}>
          <Localization>{l('coming soon...')}</Localization>
        </h2>
      )
    },
  ],
  title: 'Rockpack',
  github: 'https://github.com/AlexSergey/rockpack',
  footer: <div>License MIT, 2020</div>,
  ga: 'UA-155200418-1',
}, document.getElementById('root'));
