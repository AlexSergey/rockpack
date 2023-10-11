import { Select } from 'antd';
import { createElement } from 'react';

import { config } from '../../../../config';
import { useCurrentLanguage, useLocalizationAPI } from '../../../../features/localization';
import Ru from './flags/ru.component.svg';
import Eng from './flags/us.component.svg';
import styles from './style.module.scss';

const { Option } = Select;

const Flags = {
  en: Eng,
  ru: Ru,
};

export const LocalizationChange = (): JSX.Element => {
  const defaultValue = useCurrentLanguage();
  const { changeLanguage } = useLocalizationAPI();

  return (
    <Select className={styles.select} defaultValue={defaultValue} onChange={changeLanguage}>
      {config.languages.map((code) => (
        <Option key={code} value={code}>
          {createElement(Flags[code])}
        </Option>
      ))}
    </Select>
  );
};
