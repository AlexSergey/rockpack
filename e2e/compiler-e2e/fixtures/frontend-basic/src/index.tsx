import { createRoot } from 'react-dom/client';

const App = (): React.JSX.Element => <h1>Hello from Rockpack</h1>;

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
