import Localization, { l } from '@localazer/component';
import { ReactElement } from 'react';

import { useUserStatistic } from '../../../../features/user';
import * as styles from './style.module.scss';

export const UserStatistic = (): ReactElement => {
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
