import 'reset-css';
import 'antd/dist/antd.css';
import './assets/styles/global.scss';
import React from 'react';
import logger, { LoggerContainer } from 'logrock';
import { notify } from './utils/notifier';
import { useCurrentLanguage } from './features/Localization';
import { useAuthorization } from './features/User';
import { Main } from './routes/Main';
import { Routes } from './routes';

export const App = (): JSX.Element => {
  const currentLanguage = useCurrentLanguage();

  useAuthorization();

  return (
    <LoggerContainer logger={logger} stdout={notify}>
      <Main>
        <Routes currentLanguage={currentLanguage} />
      </Main>
    </LoggerContainer>
  );
};
