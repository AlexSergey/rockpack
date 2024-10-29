import renderer from 'react-test-renderer';
import { App } from './app';

it('React app renders correctly', async () => {
  const comp = renderer.create(<App />);

  const tree = comp.toJSON();

  expect(tree).toMatchSnapshot();
});
