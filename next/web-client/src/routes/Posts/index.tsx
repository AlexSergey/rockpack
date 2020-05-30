import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { Button } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import Localization, { l } from '@rockpack/localazer';
import styles from './styles.modules.scss';
import { usePosts, usePostsApi } from '../../features/Posts';
import { useLocalizationAPI, useCurrentLanguage } from '../../features/Localization';
import { Access } from '../../features/AuthManager';
import { Roles } from '../../types/AuthManager';
import { Languages } from '../../types/Localization';
import { useCookie } from '../../features/IsomorphicCookies';

const Posts = (): JSX.Element => {
  const token = useCookie('token');
  const { changeLanguage } = useLocalizationAPI();
  const currentLanguage = useCurrentLanguage();
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
        <Link to="/secondary">secondary</Link>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, distinctio soluta? Beatae corporis dicta
          ea, ex impedit in inventore laboriosam magnam minima nihil nostrum nulla reprehenderit rerum sint totam
          ullam.
        </p>
        {data.map(post => (
          <div key={post.id}>
            <Link to={`${currentLanguage}/posts/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <Access forRoles={[Roles.admin]}>
              <Button onClick={() => deletePost({ id: post.id, token })}>Delete post</Button>
            </Access>
            {post.Image && <img src={`http://localhost:9999/${post.Image.thumbnail}`} alt="" />}
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;
