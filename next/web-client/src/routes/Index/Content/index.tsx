import React from 'react';
import { Layout } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './styles.modules.scss';

export const Content = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
  useStyles(styles);

  return (
    <Layout.Content>
      <div className={styles.main}>
        {children}
      </div>
    </Layout.Content>
  );
};
