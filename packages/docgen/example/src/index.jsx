import React from 'react';
import createDocumentation from '../../lib';
import image from './T1H4XT8DV-UQ1GA2RSQ-bac8dd448345-512.jpeg';
import ComponentReadme from './readme.mdx';
import Localization, { l } from '@rock/localazer';

createDocumentation({
    docgen: [
        {
            title: <Localization>{l('Hello')}</Localization>,
            url: `/`,
        },
        {
            title: 'About',
            url: '/about',
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
    localization: {
        ru: {
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
        },
        us: {
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
    },
    logo: image,
    logoAlt: "Sergey",
    github: 'https://github.com/AlexSergey/rock',
    components: {
        h1: props => <h1 style={{color: 'blue'}} {...props} />
    },
    footer: <div>License MIT, 2019</div>
});
/*createDocumentation({
  title: 'Super doca',
  docgen: [
    {
      routes: [
        {
          title: 'main',
          url: '/',
          content: {
            component: <div>Hello world!</div>
          }
        }
      ]
    },
    {
      title: 'Frontend',
      routes
    }
  ],
  localization: {
    ru: '...',
    us: '...'
  },
  logo: image,
  logoAlt: "Sergey"
});
*/
