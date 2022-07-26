import { UserOutlined } from '@ant-design/icons';
import React from 'react';

import { useRole, useUser } from '../../../../features/user';

import styles from './style.module.scss';

export const User = (): JSX.Element => {
  const { email } = useUser();
  const role = useRole();

  return (
    <div className={styles.user}>
      <div className={styles.holder}>
        <UserOutlined />
        <span className={styles.email}>{email}</span>
      </div>
      <span className={styles.role}>{role}</span>
    </div>
  );
};
