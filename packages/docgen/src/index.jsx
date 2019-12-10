import React from 'react';
import createDocumentation from '../lib';
import image from './T1H4XT8DV-UQ1GA2RSQ-bac8dd448345-512.jpeg';
import ComponentReadme from './readme.mdx';

const routes = [
  {
    title: 'About',
    url: '/about',
    content: {
      title: 'About page',
      name: 'about',
      component: [
        {
          title: 'About 1',
          name: 'about1',
          component: <div>About 1<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /></div>
        },
        {
          title: 'About 2',
          name: 'about2',
          component: <div>About 2<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /></div>
        },
        {
          title: 'About 3',
          name: 'about3',
          component: <div>About 3</div>
        }
      ]
    }
  },
  {
    title: 'Components',
    url: '/components',
    content: [
      {
        title: 'Button component',
        name: 'button',
        component: ComponentReadme
      }
    ]
  }
];
createDocumentation({
    sections: [{
        name: 'test',
        children: {
            name: 'te2st 2',
            children: [
                {name: 'test3'},
                {name: 'test4'}
            ]
        }
    }]
});
/*createDocumentation({
  title: 'Super doca',
  sections: [
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
