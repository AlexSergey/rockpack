import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { Signin } from '../Signin';
import { Signup } from '../Signup';
import { Signout } from '../Signout';
import { CreatePost } from '../CreatePost';
import { UserStatistic } from '../UserStatistic';
import { Access } from '../../../features/AuthManager';
import { useCurrentLanguage } from '../../../features/Localization';
import { AuthInterface, Roles } from '../../../types/AuthManager';

export const Header = ({ signup, signin, signout }: AuthInterface): JSX.Element => {
  const currentLanguage = useCurrentLanguage();
  return (
    <Layout.Header>
      <div>
        <Access forRoles={[Roles.unauthorized]}>
          <Signin signin={signin} />
          <Signup signup={signup} />
        </Access>
        <Access forRoles={[Roles.user, Roles.admin]}>
          <Signout signout={signout} />
        </Access>
        <Access forRoles={[Roles.user, Roles.admin]}>
          <CreatePost />
        </Access>
        <Access forRoles={[Roles.user, Roles.admin]}>
          <UserStatistic />
        </Access>
        <Access forRoles={[Roles.admin]}>
          <Link to={`${currentLanguage}/users`}>Users</Link>
        </Access>
      </div>
    </Layout.Header>
  );
};
