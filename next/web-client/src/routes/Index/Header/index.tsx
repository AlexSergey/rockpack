import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { Signin } from './Signin';
import { Signup } from './Signup';
import { Signout } from './Signout';
import { CreatePost } from './CreatePost';
import { Localization } from './Localization';
import { UserStatistic } from './UserStatistic';
import { Access } from '../../../features/User';
import { useCurrentLanguage } from '../../../features/Localization';
import { Roles } from '../../../types/User';

export const Header = (): JSX.Element => {
  const currentLanguage = useCurrentLanguage();
  return (
    <Layout.Header>
      <div>
        <Access forRoles={[Roles.unauthorized]}>
          <Signin />
          <Signup />
        </Access>
        <Access forRoles={[Roles.user, Roles.admin]}>
          <Signout />
        </Access>
        <Access forRoles={[Roles.user, Roles.admin]}>
          <CreatePost />
        </Access>
        <Access forRoles={[Roles.user, Roles.admin]}>
          <UserStatistic />
        </Access>
        <Link to={`/${currentLanguage}/`}>Posts</Link>
        <Access forRoles={[Roles.admin]}>
          <Link to={`/${currentLanguage}/users`}>Users</Link>
        </Access>
        <Localization />
      </div>
    </Layout.Header>
  );
};
