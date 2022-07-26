import React from 'react';
import { Link } from 'react-router-dom';

import SvgLogo from './logo.component.svg';
import styles from './style.module.scss';

export const Logo = (): JSX.Element => (
  <Link to="/" className={styles.logo}>
    <SvgLogo />
  </Link>
);
