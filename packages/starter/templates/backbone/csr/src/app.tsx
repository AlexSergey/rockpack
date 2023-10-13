import loadable from '@loadable/component';
import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import './assets/styles/global.scss';
import { MainPage } from './pages/main-page';

const Home = loadable(() => import('./pages/home/home.loadable'));
const Image = loadable(() => import('./pages/image/image.loadable'));

export const App = (): ReactElement => (
  <MainPage>
    <Routes>
      <Route element={<Home />} index />
      <Route element={<Image />} path="image" />
      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  </MainPage>
);
