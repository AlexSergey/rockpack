import Localization, { l } from '@localazer/component';
import { Button } from 'antd';

import { useUserApi } from '../../../../features/user';

export const Signout = (): JSX.Element => {
  const { signout } = useUserApi();

  return (
    <Button onClick={signout} type="primary">
      <Localization>{l('Sign Out')}</Localization>
    </Button>
  );
};
