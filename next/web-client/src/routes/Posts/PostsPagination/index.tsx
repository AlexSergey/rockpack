import React from 'react';
import { Pagination } from 'antd';
import config from '../../../config';
import { usePagination, usePaginationApi } from '../../../features/Posts';

import styles from './style.module.scss';

export const PostsPagination = (): JSX.Element => {
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
          onChange={setCurrent}
        />
      )}
    </div>
  );
};
