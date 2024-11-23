import { Pagination } from 'antd';
import { ReactElement } from 'react';

import { config } from '../../../config';
import { usePagination, usePaginationApi } from '../../../features/posts';
import * as styles from './style.module.scss';

export const PostsPagination = (): ReactElement => {
  const { setCurrent } = usePaginationApi();
  const { count, current } = usePagination();

  return (
    <div className={styles['posts-pagination']}>
      {count > config.postsLimit && (
        <Pagination defaultCurrent={current} onChange={setCurrent} pageSize={config.postsLimit} simple total={count} />
      )}
    </div>
  );
};
