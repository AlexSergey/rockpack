import './globalStyles.scss';
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { addParameters } from '@storybook/react';
import { TableComponent } from './Components/TableProps';

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