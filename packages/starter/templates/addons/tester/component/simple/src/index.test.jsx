import { render } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import RockpackComponent from './index.jsx';

it('Render React Component', () => {
  const { getByText } = render(<RockpackComponent />);
  const element = getByText(/Rockpack/i);

  expect(element)
    .toBeInTheDocument();
});
