import './assets/styles/global.scss';
import loadable from '@loadable/component';
import { Routes, Navigate, Route } from 'react-router-dom';

import { MainPage } from './pages/main-page';

const Home = loadable(() => import('./pages/home/home.loadable'));
const Image = loadable(() => import('./pages/image/image.loadable'));

export const App = () => (
  <MainPage>
    <Routes>
      <Route index element={<Home />} />
      <Route path="image" element={<Image />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </MainPage>
);
