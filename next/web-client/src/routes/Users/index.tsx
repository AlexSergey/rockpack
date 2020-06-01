import React from 'react';
import { Button } from 'antd';
import { useUsers, useUsersApi } from '../../features/Users';
import { Access, NotOwner } from '../../features/AuthManager';
import { Roles } from '../../types/AuthManager';

const Users = (): JSX.Element => {
  const users = useUsers();
  const usersApi = useUsersApi();
  return (
    <div>
      {Array.isArray(users) && users.map(user => (
        <div key={user.id}>
          {user.email}
          <Access forRoles={[Roles.admin]}>
            <NotOwner forUser={user.email}>
              <Button onClick={() => usersApi.deleteUser(user.id)}>
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
