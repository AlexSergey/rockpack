import React from 'react';
import Localization, { l } from '@localazer/component';

import styles from './style.module.scss';

export const Error = (): JSX.Element => (
  <div className={styles['error-block']}>
    <h3><Localization>{l('Something went wrong. Try later, please.')}</Localization></h3>
  </div>
);
