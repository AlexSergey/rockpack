import React from 'react';
import { Button } from 'antd';
import { AuthInterface } from '../../../types/AuthManager';

export const Signout = ({ signout }: Pick<AuthInterface, 'signout'>): JSX.Element => (
  <Button type="primary" onClick={signout}>
    Sign Out
  </Button>
);
