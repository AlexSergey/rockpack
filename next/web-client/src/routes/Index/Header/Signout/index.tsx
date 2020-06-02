import React from 'react';
import { Button } from 'antd';
import { useUserApi } from '../../../../features/User';

export const Signout = (): JSX.Element => {
  const { signout } = useUserApi();

  return (
    <Button type="primary" onClick={signout}>
      Sign Out
    </Button>
  );
};
