import Localization, { l } from '@localazer/component';
import { ReactElement } from 'react';

import styles from './style.module.scss';

export const Error = (): ReactElement => (
  <div className={styles['error-block']}>
    <h3>
      <Localization>{l('Something went wrong. Try later, please.')}</Localization>
    </h3>
  </div>
);
