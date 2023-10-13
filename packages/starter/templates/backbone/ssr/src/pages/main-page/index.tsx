import { ReactElement } from 'react';

import { Navigation } from './components/navigation';
import styles from './styles.module.scss';

export const MainPage = ({ children }: { children: ReactElement }): ReactElement => (
  <div>
    <Navigation />
    <div className={styles.wrapper}>{children}</div>
  </div>
);
