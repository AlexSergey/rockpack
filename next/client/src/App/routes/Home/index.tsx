import React from 'react';
import { Link } from 'react-router-dom';
import { useUssrState, useWillMount } from '@rock/ussr';
import MetaTags from 'react-meta-tags';
import useStyles from 'isomorphic-style-loader/useStyles';
import Localization, { l } from '@rock/localazer';
import { effect } from './effect';
import styles from './styles.modules.scss';

import { useLocalizationAPI } from '../../../localization';

interface StateInterface {
  text: string;
}

const Home = (): JSX.Element => {
  const { changeLanguage } = useLocalizationAPI();
  useStyles(styles);
  const [state, setState] = useUssrState<StateInterface>('appState.text', { text: 'i am test ' });

  useWillMount(() => effect()
    .then(data => setState(data)));

  return (
    <>
      <MetaTags>
        <title>Home</title>
        <meta name="description" content="Home page" />
      </MetaTags>
      <div className={styles.block}>
        <h1>{state.text}</h1>
        <h2>{state.text}</h2>
        <h3>{state.text}</h3>
        <h4>{state.text}</h4>
        <p><Localization>{l('Hello')}</Localization></p>
        <button type="button" onClick={(): void => changeLanguage('ru')}>Change</button>
        <Link to="/secondary">secondary</Link>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, distinctio soluta? Beatae corporis dicta
          ea, ex impedit in inventore laboriosam magnam minima nihil nostrum nulla reprehenderit rerum sint totam
          ullam.
        </p>
      </div>
    </>
  );
};

export default Home;
