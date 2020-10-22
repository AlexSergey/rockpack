import React from 'react';
import { Link } from 'react-router-dom';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './styles.module.scss';

const Navigation = (): JSX.Element => {
  useStyles(styles);

  return (
    <div className={styles['nav-holder']}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/image">Image</Link></li>
      </ul>
    </div>
  );
};

export default Navigation;
