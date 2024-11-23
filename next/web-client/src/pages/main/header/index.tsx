import Localization, { l } from '@localazer/component';
import { Button, Dropdown, Layout, Menu } from 'antd';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentLanguage } from '../../../features/localization';
import { Access } from '../../../features/user';
import { Roles } from '../../../types/user';
import { CreatePost } from './create-post';
import { LocalizationChange } from './localization-change';
import { Logo } from './logo';
import { Signin } from './signin';
import { Signout } from './signout';
import { Signup } from './signup';
import * as styles from './style.module.scss';
import { User } from './user';
import { UserStatistic } from './user-statistic';

export const Header = (): ReactElement => {
  const currentLanguage = useCurrentLanguage();

  return (
    <Layout.Header>
      <div className={styles['nav-holder']}>
        <Menu className={styles['nav-main']} mode="horizontal" selectable={false} theme="dark">
          <Menu.Item key="logo">
            <Logo />
          </Menu.Item>
        </Menu>
        <Menu className={styles['nav-secondary']} mode="horizontal" selectable={false} theme="dark">
          <Menu.Item key="localizationChange">
            <LocalizationChange />
          </Menu.Item>
          <Menu.Item key="user">
            <Access forRoles={[Roles.user, Roles.admin]}>
              <Dropdown
                overlay={(): ReactElement => (
                  <Menu selectable={false} theme="dark">
                    <Menu.Item key="user-statistic">
                      <UserStatistic />
                    </Menu.Item>
                    <Menu.Item key="users">
                      <Access forRoles={[Roles.admin]}>
                        <Button>
                          <Link to={`/${currentLanguage}/users`}>
                            <Localization>{l('Users')}</Localization>
                          </Link>
                        </Button>
                      </Access>
                    </Menu.Item>
                    <Menu.Item key="create-post">
                      <CreatePost />
                    </Menu.Item>
                    <Menu.Item key="signout">
                      <Signout />
                    </Menu.Item>
                  </Menu>
                )}
              >
                <span>
                  <User />
                </span>
              </Dropdown>
            </Access>

            <Access forRoles={[Roles.unauthorized]}>
              <Signup />
            </Access>
          </Menu.Item>
          <Menu.Item key="signin">
            <Access forRoles={[Roles.unauthorized]}>
              <Signin />
            </Access>
          </Menu.Item>
        </Menu>
      </div>
    </Layout.Header>
  );
};
