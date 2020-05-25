import React from 'react';
import { Layout } from 'antd';
import { Signin } from '../Signin';
import { Signup } from '../Signup';
import { Signout } from '../Signout';
import { Access } from '../../features/AuthManager';
import { AuthInterface, Roles } from '../../types/AuthManager';

export const Header = ({ signup, signin, signout }: AuthInterface): JSX.Element => (
  <Layout.Header>
    <div>
      <Access forRoles={[Roles.unauthorized]}>
        <Signin signin={signin} />
        <Signup signup={signup} />
      </Access>
      <Access forRoles={[Roles.user, Roles.admin]}>
        <Signout signout={signout} />
      </Access>
    </div>
  </Layout.Header>
);
