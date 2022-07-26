import { Layout } from 'antd';
import React from 'react';

import styles from './style.module.scss';

export const Content = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => (
  <Layout.Content>
    <div className={styles.main}>{children}</div>
  </Layout.Content>
);
