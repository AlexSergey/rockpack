import renderer, { act } from 'react-test-renderer';

import { createAppWrapper } from '../../../../tests/create-app-wrapper';
import { sleep } from '../../../../tests/helpers';
import { ImageArea } from './index';

it('ImageArea renders correctly', async () => {
  const AppWrapper = createAppWrapper();
  const imageArea = renderer.create(
    <AppWrapper>
      <ImageArea />
    </AppWrapper>,
  );

  await act(sleep(100));

  const tree = imageArea.toJSON();

  expect(tree).toMatchSnapshot();
});
