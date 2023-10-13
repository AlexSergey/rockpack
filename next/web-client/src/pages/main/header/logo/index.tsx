import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import SvgLogo from './logo.component.svg';
import styles from './style.module.scss';

export const Logo = (): ReactElement => (
  <Link className={styles.logo} to="/">
    <SvgLogo />
  </Link>
);
