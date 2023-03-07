import { Pagination } from 'antd';
import React from 'react';

import { config } from '../../../config';
import { usePagination, usePaginationApi } from '../../../features/posts';

import styles from './style.module.scss';

export const PostsPagination = (): JSX.Element => {
  const { setCurrent } = usePaginationApi();
  const { current, count } = usePagination();

  return (
    <div className={styles['posts-pagination']}>
      {count > config.postsLimit && (
        <Pagination simple pageSize={config.postsLimit} defaultCurrent={current} total={count} onChange={setCurrent} />
      )}
    </div>
  );
};