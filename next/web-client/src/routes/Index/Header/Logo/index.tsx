import React from 'react';
import { Link } from 'react-router-dom';
import useStyles from 'isomorphic-style-loader/useStyles';
import SvgLogo from './logo.component.svg';
import styles from './style.module.scss';

export const Logo = (): JSX.Element => {
  useStyles(styles);

  return (
    <Link to="/" className={styles.logo}>
      <SvgLogo />
    </Link>
  );
};
