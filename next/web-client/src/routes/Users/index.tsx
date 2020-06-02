import React from 'react';
import { Button } from 'antd';
import { useUsers, useUsersApi } from '../../features/Users';
import { Access, NotOwner } from '../../features/User';
import { Roles } from '../../types/User';

const Users = (): JSX.Element => {
  const users = useUsers();
  const usersApi = useUsersApi();
  return (
    <div>
      {Array.isArray(users) && users.map((user): JSX.Element => (
        <div key={user.id}>
          {user.email}
          <Access forRoles={[Roles.admin]}>
            <NotOwner forUser={user.email}>
              <Button onClick={(): void => usersApi.deleteUser(user.id)}>
                Delete user
              </Button>
            </NotOwner>
          </Access>
        </div>
      ))}
    </div>
  );
};

export default Users;
