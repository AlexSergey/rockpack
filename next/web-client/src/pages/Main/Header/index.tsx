/* eslint-disable react/no-unstable-nested-components */
import Localization, { l } from '@localazer/component';
import { Layout, Menu, Dropdown, Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { useCurrentLanguage } from '../../../features/Localization';
import { Access } from '../../../features/User';
import { Roles } from '../../../types/user';

import { CreatePost } from './CreatePost';
import { LocalizationChange } from './LocalizationChange';
import { Logo } from './Logo';
import { Signin } from './Signin';
import { Signout } from './Signout';
import { Signup } from './Signup';
import { User } from './User';
import { UserStatistic } from './UserStatistic';
import styles from './style.module.scss';

export const Header = (): JSX.Element => {
  const currentLanguage = useCurrentLanguage();

  return (
    <Layout.Header>
      <div className={styles['nav-holder']}>
        <Menu className={styles['nav-main']} theme="dark" mode="horizontal" selectable={false}>
          <Menu.Item>
            <Logo />
          </Menu.Item>
        </Menu>
        <Menu className={styles['nav-secondary']} theme="dark" mode="horizontal" selectable={false}>
          <Menu.Item>
            <LocalizationChange />
          </Menu.Item>
          <Menu.Item>
            <Access forRoles={[Roles.user, Roles.admin]}>
              <Dropdown
                overlay={(): JSX.Element => (
                  <Menu theme="dark" selectable={false}>
                    <Menu.Item>
                      <UserStatistic />
                    </Menu.Item>
                    <Menu.Item>
                      <Access forRoles={[Roles.admin]}>
                        <Button>
                          <Link to={`/${currentLanguage}/users`}>
                            <Localization>{l('Users')}</Localization>
                          </Link>
                        </Button>
                      </Access>
                    </Menu.Item>
                    <Menu.Item>
                      <CreatePost />
                    </Menu.Item>
                    <Menu.Item>
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
          <Menu.Item>
            <Access forRoles={[Roles.unauthorized]}>
              <Signin />
            </Access>
          </Menu.Item>
        </Menu>
      </div>
    </Layout.Header>
  );
};
