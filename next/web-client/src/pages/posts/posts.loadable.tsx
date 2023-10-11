import { CloseOutlined } from '@ant-design/icons';
import Localization, { l } from '@localazer/component';
import { Button } from 'antd';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Error } from '../../components/error';
import { Loader } from '../../components/loader';
import { useCurrentLanguage } from '../../features/localization';
import { usePosts, usePostsApi } from '../../features/posts';
import { Access, Owner, useUser } from '../../features/user';
import { Roles } from '../../types/user';
import { dateFormatter } from '../../utils/date-format';
import { PostsPagination } from './posts-pagination';
import styles from './style.module.scss';

const Posts = (): JSX.Element => {
  const currentLanguage = useCurrentLanguage();
  const currentUser = useUser();
  const [loading, error, data] = usePosts();
  const { deletePost } = usePostsApi();

  return (
    <>
      <Helmet>
        <title>{l('Posts')()}</title>
        <meta content={l('Posts page. Here you find the most popular posts on the Internet')()} name="description" />
      </Helmet>
      <div className={styles.posts}>
        {loading && <Loader />}
        {error && <Error />}
        {data.map((post, index) => (
          <div className={`${styles.post} ${data.length - 1 === index && styles['post-last']}`} key={post.id}>
            <Access forRoles={[Roles.admin]}>
              {(roleMatched): JSX.Element =>
                roleMatched ? (
                  <Button
                    className={styles.delete}
                    danger
                    onClick={(): void => deletePost(post.id, currentUser.email === post.User.email)}
                  >
                    <CloseOutlined />
                  </Button>
                ) : (
                  <Owner forUser={post.User.email}>
                    <Button
                      className={styles.delete}
                      danger
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
                <img alt="" src={`http://localhost:9999/${post.Preview.thumbnail}`} />
              </div>
            )}
            <Link className={styles.title} to={`/${currentLanguage}/posts/${post.id}`}>
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
