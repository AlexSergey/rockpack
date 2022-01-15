import './assets/styles/global.scss';
import { Routes, Navigate, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import Index from './pages/Index';

const Home = loadable(() => import('./pages/Home'));
const Image = loadable(() => import('./pages/Image'));

const App = () => (
  <Index>
    <Routes>
      <Route index element={<Home />} />
      <Route path="image" element={<Image />} />
      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  </Index>
);

export default App;
