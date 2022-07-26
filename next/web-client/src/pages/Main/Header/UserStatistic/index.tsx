import Localization, { l } from '@localazer/component';
import React from 'react';

import { useUserStatistic } from '../../../../features/User';

import styles from './style.module.scss';

export const UserStatistic = (): JSX.Element => {
  const { comments, posts } = useUserStatistic();

  return (
    <span className={styles.statistic}>
      <span className={styles.item}>
        <Localization>{l('Comments')}</Localization>: {comments}
      </span>
      <span className={styles.item}>
        <Localization>{l('Posts')}</Localization>: {posts}
      </span>
    </span>
  );
};
