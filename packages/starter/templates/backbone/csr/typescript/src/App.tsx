import './assets/styles/global.scss';
import { Routes, Navigate, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import Index from './routes/Index';

const Home = loadable(() => import('./routes/Home'));
const Image = loadable(() => import('./routes/Image'));

const App = (): JSX.Element => (
  <Index>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/image" element={<Image />} />
      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  </Index>
);

export default App;
