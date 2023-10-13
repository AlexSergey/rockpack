import Localization, { l } from '@localazer/component';
import { Button } from 'antd';
import { ReactElement } from 'react';

import { useUserApi } from '../../../../features/user';

export const Signout = (): ReactElement => {
  const { signout } = useUserApi();

  return (
    <Button onClick={signout} type="primary">
      <Localization>{l('Sign Out')}</Localization>
    </Button>
  );
};
