import { Layout as LayoutPage } from 'antd';
import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './styles.modules.scss';

export const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
  useStyles(styles);

  return (
    <LayoutPage className="main-content-layout">
      <LayoutPage.Header>
        header
      </LayoutPage.Header>
      <LayoutPage.Content>
        <div className={styles.main}>
          {children}
        </div>
      </LayoutPage.Content>
      <LayoutPage.Footer>
        Footer
      </LayoutPage.Footer>
    </LayoutPage>
  );
};
