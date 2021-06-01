import React from 'react';
import { Button } from 'antd';
import Localization, { l } from '@localazer/component';
import { useUserApi } from '../../../../features/User';

export const Signout = (): JSX.Element => {
  const { signout } = useUserApi();

  return (
    <Button type="primary" onClick={signout}>
      <Localization>{l('Sign Out')}</Localization>
    </Button>
  );
};
