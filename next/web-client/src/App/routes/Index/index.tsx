import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import useStyles from 'isomorphic-style-loader/useStyles';
import Localization, { l } from '@rockpack/localazer';
import styles from './styles.modules.scss';
import { usePosts } from './features/Posts';
import { useLocalizationAPI, useCurrentLanguage } from '../../../localization';

const Index = (): JSX.Element => {
  const { changeLanguage } = useLocalizationAPI();
  const currentLanguage = useCurrentLanguage();
  useStyles(styles);

  const [, , data] = usePosts();

  return (
    <>
      <MetaTags>
        <title>Home</title>
        <meta name="description" content="Home page" />
      </MetaTags>
      <div className={styles.block}>
        <p><Localization>{l('Hello')}</Localization></p>
        <button type="button" onClick={(): void => changeLanguage('ru')}>Change</button>
        <Link to="/secondary">secondary</Link>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, distinctio soluta? Beatae corporis dicta
          ea, ex impedit in inventore laboriosam magnam minima nihil nostrum nulla reprehenderit rerum sint totam
          ullam.
        </p>
        {data.map(post => (
          <Link to={`${currentLanguage}/posts/${post.id}`}>
            <h2>{post.title}</h2>
            <img src={`http://localhost:9999/${post.Image.thumbnail}`} alt="" />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Index;
