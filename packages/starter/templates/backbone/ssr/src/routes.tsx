import loadable from '@loadable/component';
import { Navigate } from 'react-router-dom';

import './assets/styles/global.scss';
import { MainPage } from './pages/main-page';

const Home = loadable(() => import('./pages/home/home.loadable'), {
  fallback: <div>Loading...</div>,
});

const Image = loadable(() => import('./pages/image/image.loadable'), {
  fallback: <div>Loading...</div>,
});

export const routes = [
  {
    children: [
      {
        element: <Home />,
        path: '/',
      },
      {
        element: <Image />,
        path: '/image',
      },
      {
        element: <Navigate to="/" />,
        path: '*',
      },
    ],
    element: <MainPage />,
    path: '/',
  },
];
