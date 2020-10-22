import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import Localization, { l } from '@rockpack/localazer';

import styles from './style.module.scss';

export const Error = (): JSX.Element => {
  useStyles(styles);

  return (
    <div className={styles['error-block']}>
      <h3><Localization>{l('Something went wrong. Try later, please.')}</Localization></h3>
    </div>
  );
};
