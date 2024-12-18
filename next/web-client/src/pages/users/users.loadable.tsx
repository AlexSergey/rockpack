import { UserDeleteOutlined } from '@ant-design/icons';
import Localization, { l } from '@localazer/component';
import { Button } from 'antd';
import { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';

import { Access, NotOwner } from '../../features/user';
import { useUsers, useUsersApi } from '../../features/users';
import { Roles } from '../../types/user';
import * as styles from './style.module.scss';

const Users = (): ReactElement => {
  const users = useUsers();
  const usersApi = useUsersApi();
  const hasUsers = Array.isArray(users) && users.length > 0;

  return (
    <>
      <Helmet>
        <title>{l('Users')()}</title>
        <meta content={l('Users list')()} name="description" />
      </Helmet>
      <div className={styles.users}>
        {hasUsers && (
          <h1>
            <Localization>{l('Users')}</Localization>
          </h1>
        )}
        {hasUsers && (
          <ul className={styles['user-list']}>
            {users.map(
              (user): ReactElement => (
                <li key={user.id}>
                  {user.email}
                  <Access forRoles={[Roles.admin]}>
                    <NotOwner forUser={user.email}>
                      <Button onClick={(): void => usersApi.deleteUser(user.id)}>
                        <UserDeleteOutlined />
                      </Button>
                    </NotOwner>
                  </Access>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default Users;
