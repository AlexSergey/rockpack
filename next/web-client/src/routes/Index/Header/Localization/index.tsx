import React from 'react';
import { Select } from 'antd';
import FlagIconFactory from 'react-flag-icon-css';
import config from '../../../../config';
import { useCurrentLanguage, useLocalizationAPI } from '../../../../features/Localization';
import { Languages } from '../../../../types/Localization';

const { Option } = Select;
const FlagIcon = FlagIconFactory(React, { useCssModules: false });

const getCode = (code: Languages): string => {
  if (code === 'en') {
    return 'us';
  }
  return code;
};

export const Localization = (): JSX.Element => {
  const defaultValue = useCurrentLanguage();
  const { changeLanguage } = useLocalizationAPI();

  return (
    <div>
      <Select defaultValue={defaultValue} onChange={changeLanguage}>
        {config.languages.map(code => (
          <Option key={code} value={code}>
            <FlagIcon code={getCode(code)} />
          </Option>
        ))}
      </Select>
    </div>
  );
};
