import { UserOutlined } from '@ant-design/icons';
import { Popover } from 'antd';

import { useRole, useUser } from '../../../../features/user';

import styles from './style.module.scss';

export const User = (): JSX.Element => {
  const { email } = useUser();
  const role = useRole();

  return (
    <div className={styles.user}>
      <div className={styles.holder}>
        <Popover placement="top" content={email} trigger="hover">
          <UserOutlined />
        </Popover>
      </div>
      <span className={styles.role}>{role}</span>
    </div>
  );
};
