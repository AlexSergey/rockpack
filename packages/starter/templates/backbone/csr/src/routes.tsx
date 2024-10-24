import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

import './assets/styles/global.scss';
import { MainPage } from './pages/main-page';

const Home = lazy(() => import('./pages/home/home.lazy'));
const Image = lazy(() => import('./pages/image/image.lazy'));

export const routes = [
  {
    children: [
      {
        element: (
          <Suspense fallback={<div>Loading</div>}>
            <Home />
          </Suspense>
        ),
        path: '/',
      },
      {
        element: (
          <Suspense fallback={<div>Loading</div>}>
            <Image />
          </Suspense>
        ),
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
