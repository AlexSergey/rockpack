import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import Localization, { l } from '@rockpack/localazer';
import { useUserStatistic } from '../../../../features/User';

import styles from './style.module.scss';

export const UserStatistic = (): JSX.Element => {
  useStyles(styles);
  const { comments, posts } = useUserStatistic();

  return (
    <span className={styles.statistic}>
      <span className={styles.item}><Localization>{l('Comments')}</Localization>: {comments}</span>
      <span className={styles.item}><Localization>{l('Posts')}</Localization>: {posts}</span>
    </span>
  );
};
