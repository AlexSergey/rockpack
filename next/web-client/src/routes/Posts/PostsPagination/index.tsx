import React from 'react';
import { Pagination } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import config from '../../../config';
import { useCurrentLanguage } from '../../../features/Localization';
import { usePagination, usePaginationApi } from '../../../features/Posts';

import styles from './style.module.scss';

export const PostsPagination = (): JSX.Element => {
  useStyles(styles);

  const currentLanguage = useCurrentLanguage();
  const { setCurrent } = usePaginationApi();
  const { current, count } = usePagination();

  return (
    <div className={styles['posts-pagination']}>
      {count > config.postsLimit && (
        <Pagination
          simple
          pageSize={config.postsLimit}
          defaultCurrent={current}
          total={count}
          onChange={(val): void => {
            setCurrent(currentLanguage, val);
          }}
        />
      )}
    </div>
  );
};
