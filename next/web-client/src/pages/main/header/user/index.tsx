import { UserOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { ReactElement } from 'react';

import { useRole, useUser } from '../../../../features/user';
import * as styles from './style.module.scss';

export const User = (): ReactElement => {
  const { email } = useUser();
  const role = useRole();

  return (
    <div className={styles.user}>
      <div className={styles.holder}>
        <Popover content={email} placement="top" trigger="hover">
          <UserOutlined />
        </Popover>
      </div>
      <span className={styles.role}>{role}</span>
    </div>
  );
};
