import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { Button } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import Localization, { l, useI18n } from '@rockpack/localazer';
import { usePosts, usePostsApi } from '../../features/Posts';
import { useCurrentLanguage } from '../../features/Localization';
import { Access, Owner, useUser } from '../../features/User';
import { Roles } from '../../types/User';
import { PostsPagination } from './PostsPagination';
import { dateFormatter } from '../../utils/dateFormat';
import { Error } from '../../components/Error';
import { Loader } from '../../components/Loader';

import styles from './style.modules.scss';

const Posts = (): JSX.Element => {
  useStyles(styles);

  const i18n = useI18n();
  const currentLanguage = useCurrentLanguage();
  const currentUser = useUser();

  const [loading, error, data] = usePosts();
  const { deletePost } = usePostsApi();

  return (
    <>
      <MetaTags>
        <title>{l('Posts')(i18n)}</title>
        <meta name="description" content={l('Posts page. Here you find the most popular posts on the Internet')(i18n)} />
      </MetaTags>
      <div className={styles.posts}>
        {loading && <Loader />}
        {error && <Error />}
        {data.map((post, index) => (
          <div key={post.id} className={`${styles.post} ${data.length - 1 === index && styles['post-last']}`}>
            <Access forRoles={[Roles.admin]}>
              {(roleMatched): JSX.Element => (roleMatched ? (
                <Button
                  danger
                  className={styles.delete}
                  onClick={(): void => deletePost(post.id, currentUser.email === post.User.email)}
                >
                  <CloseOutlined />
                </Button>
              ) : (
                <Owner forUser={post.User.email}>
                  <Button
                    danger
                    className={styles.delete}
                    onClick={(): void => deletePost(post.id, currentUser.email === post.User.email)}
                  >
                    <CloseOutlined />
                  </Button>
                </Owner>
              ))}
            </Access>
            {post.Preview && (
              <div className={styles['preview-holder']}>
                <img
                  src={`http://localhost:9999/${post.Preview.thumbnail}`}
                  alt=""
                />
              </div>
            )}
            <Link to={`${currentLanguage}/posts/${post.id}`} className={styles.title}>
              <h2>{post.title}</h2>
            </Link>
            <div className={styles.extra}>
              <span className={styles.date}>{dateFormatter(post.createdAt)}</span>
              <span className={styles.comments}><Localization>{l('Comments')}</Localization> {post.Statistic.comments}</span>
            </div>
          </div>
        ))}
        <PostsPagination />
      </div>
    </>
  );
};

export default Posts;
