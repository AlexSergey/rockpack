import './globalStyles.scss';
import 'reset-css';
import 'antd/dist/antd.css';
import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { TableComponent } from './Components/TableProps';
import { StyleProvider } from './StyleProvider';
import { LocalizationProvider } from './LocalizationProvider';

addParameters({
  backgrounds: [
    { name: 'twitter', value: '#00aced', default: true },
    { name: 'facebook', value: '#3b5998' },
  ],
  options: {
    showPanel: true
  }
});

addDecorator(withInfo({
  TableComponent,
  source: false,
  header: false,
  inline: true
}));

addDecorator(StyleProvider);
addDecorator(LocalizationProvider);
