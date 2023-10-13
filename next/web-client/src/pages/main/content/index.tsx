import { Layout } from 'antd';
import { ReactElement } from 'react';

import styles from './style.module.scss';

export const Content = ({ children }: { children: ReactElement | ReactElement[] }): ReactElement => (
  <Layout.Content>
    <div className={styles.main}>{children}</div>
  </Layout.Content>
);
