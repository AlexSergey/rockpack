import { ReactElement } from 'react';
import { Outlet } from 'react-router';

import { Navigation } from './components/navigation';
import * as styles from './styles.module.scss';

export const MainPage = (): ReactElement => (
  <div>
    <Navigation />
    <div className={styles.wrapper}>
      <Outlet />
    </div>
  </div>
);
