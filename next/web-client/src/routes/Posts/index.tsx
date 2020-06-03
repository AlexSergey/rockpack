import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { Button } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import Localization, { l } from '@rockpack/localazer';
import styles from './styles.modules.scss';
import { usePosts, usePostsApi } from '../../features/Posts';
import { useLocalizationAPI, useCurrentLanguage } from '../../features/Localization';
import { Access, Owner, useUser } from '../../features/User';
import { Roles } from '../../types/User';
import { Languages } from '../../types/Localization';

const Posts = (): JSX.Element => {
  const { changeLanguage } = useLocalizationAPI();
  const currentLanguage = useCurrentLanguage();
  const currentUser = useUser();

  useStyles(styles);

  const [, , data] = usePosts();
  const { deletePost } = usePostsApi();

  return (
    <>
      <MetaTags>
        <title>Home</title>
        <meta name="description" content="Home page" />
      </MetaTags>
      <div className={styles.block}>
        <p><Localization>{l('Hello')}</Localization></p>
        <button type="button" onClick={(): void => changeLanguage(Languages.ru)}>Change</button>
        {data.map(post => (
          <div key={post.id}>
            <Link to={`${currentLanguage}/posts/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <Access forRoles={[Roles.admin]}>
              {(roleMatched): JSX.Element => (roleMatched ? (
                <Button
                  onClick={(): void => deletePost(post.id, currentUser.email === post.User.email)}
                >
                  Delete post
                </Button>
              ) : (
                <Owner forUser={post.User.email}>
                  <Button
                    onClick={(): void => deletePost(post.id, currentUser.email === post.User.email)}
                  >
                    Delete post
                  </Button>
                </Owner>
              ))}
            </Access>
            {post.Image && <img src={`http://localhost:9999/${post.Image.thumbnail}`} alt="" />}
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;
