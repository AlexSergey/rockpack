import { Navigation } from './components/navigation';
import styles from './styles.module.scss';

export const MainPage = ({ children }: { children: JSX.Element }): JSX.Element => (
  <div>
    <Navigation />
    <div className={styles.wrapper}>{children}</div>
  </div>
);
