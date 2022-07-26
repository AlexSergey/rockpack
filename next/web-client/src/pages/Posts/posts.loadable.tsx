import { CloseOutlined } from '@ant-design/icons';
import Localization, { l } from '@localazer/component';
import { Button } from 'antd';
import React from 'react';
import MetaTags from 'react-meta-tags';
import { Link } from 'react-router-dom';

import { Error } from '../../components/Error';
import { Loader } from '../../components/Loader';
import { useCurrentLanguage } from '../../features/Localization';
import { usePosts, usePostsApi } from '../../features/Posts';
import { Access, Owner, useUser } from '../../features/User';
import { Roles } from '../../types/user';
import { dateFormatter } from '../../utils/date-format';

import { PostsPagination } from './PostsPagination';
import styles from './style.module.scss';

const Posts = (): JSX.Element => {
  const currentLanguage = useCurrentLanguage();
  const currentUser = useUser();
  const [loading, error, data] = usePosts();
  const { deletePost } = usePostsApi();

  return (
    <>
      <MetaTags>
        <title>{l('Posts')()}</title>
        <meta name="description" content={l('Posts page. Here you find the most popular posts on the Internet')()} />
      </MetaTags>
      <div className={styles.posts}>
        {loading && <Loader />}
        {error && <Error />}
        {data.map((post, index) => (
          <div key={post.id} className={`${styles.post} ${data.length - 1 === index && styles['post-last']}`}>
            <Access forRoles={[Roles.admin]}>
              {(roleMatched): JSX.Element =>
                roleMatched ? (
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
                )
              }
            </Access>
            {post.Preview && (
              <div className={styles['preview-holder']}>
                <img src={`http://localhost:9999/${post.Preview.thumbnail}`} alt="" />
              </div>
            )}
            <Link to={`${currentLanguage}/posts/${post.id}`} className={styles.title}>
              <h2>{post.title}</h2>
            </Link>
            <div className={styles.extra}>
              <span className={styles.date}>{dateFormatter(post.createdAt)}</span>
              <span className={styles.comments}>
                <Localization>{l('Comments')}</Localization> {post.Statistic.comments}
              </span>
            </div>
          </div>
        ))}
        <PostsPagination />
      </div>
    </>
  );
};

export default Posts;
