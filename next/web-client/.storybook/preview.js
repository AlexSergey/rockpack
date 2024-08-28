import { withInfo } from '@storybook/addon-info';
import { addDecorator, addParameters } from '@storybook/react';
import 'antd/dist/antd.css';
import 'reset-css';

import { TableComponent } from './Components/TableProps';
import './globalStyles.scss';
import { LocalizationProvider } from './LocalizationProvider';

addParameters({
  backgrounds: [
    { default: true, name: 'twitter', value: '#00aced' },
    { name: 'facebook', value: '#3b5998' },
  ],
  options: {
    showPanel: true,
  },
});

addDecorator(
  withInfo({
    header: false,
    inline: true,
    source: false,
    TableComponent,
  }),
);

addDecorator(LocalizationProvider);
