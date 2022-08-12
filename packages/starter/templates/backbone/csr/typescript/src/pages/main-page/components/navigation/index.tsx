import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

export const Navigation = (): JSX.Element => (
  <div className={styles['nav-holder']}>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/image">Image</Link>
      </li>
    </ul>
  </div>
);
