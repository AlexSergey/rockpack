import { themes } from '@storybook/theming';
import { create } from '@storybook/theming/create';

import logo from './images/logo.png';

export default create({
  base: 'dark',

  //colorPrimary: 'hotpink',
  //colorSecondary: 'deepskyblue',

  // UI
  //appBg: 'white',
  //appContentBg: 'silver',
  //appBorderColor: 'grey',
  //appBorderRadius: 4,

  brandImage: logo,
  brandTitle: 'My custom storybook',

  // Text colors
  //textColor: 'black',
  //textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  //barTextColor: 'silver',
  //barSelectedColor: 'black',
  //barBg: 'hotpink',

  // Form colors
  //inputBg: 'white',
  //inputBorder: 'silver',
  //inputTextColor: 'black',
  //inputBorderRadius: 4,

  brandUrl: 'https://example.com',
  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',
});
