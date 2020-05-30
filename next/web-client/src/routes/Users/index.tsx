import React from 'react';
import { useUsers } from '../../features/Users';
import { useCookie } from '../../features/IsomorphicCookies';

const Users = (): JSX.Element => {
  const token = useCookie('token');
  const users = useUsers(token);
  return (
    <div>
      {Array.isArray(users) && users.map(user => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
};

export default Users;
