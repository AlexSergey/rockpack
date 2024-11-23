import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import * as styles from './styles.module.scss';

export const Navigation = (): ReactElement => (
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
