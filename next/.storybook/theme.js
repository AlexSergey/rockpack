import { create } from '@storybook/theming/create';
import { themes } from '@storybook/theming';
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
  
  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',
  
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
  
  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: logo,
});