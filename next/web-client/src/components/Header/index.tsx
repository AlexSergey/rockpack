import React from 'react';
import { Layout } from 'antd';
import { Signin } from '../Signin';
import { Signup } from '../Signup';
import { AuthInterface } from '../../types/AuthManager';

export const Header = ({ signup, signin }: AuthInterface): JSX.Element => (
  <Layout.Header>
    <div>
      <Signin signin={signin} />
      <Signup signup={signup} />
    </div>
  </Layout.Header>
);
