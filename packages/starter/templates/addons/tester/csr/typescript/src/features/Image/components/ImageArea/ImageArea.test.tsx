import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ImageArea } from './index';
import { createAppWrapper } from '../../../../tests/createAppWrapper';
import { sleep } from '../../../../tests/helpers';

it('ImageArea renders correctly', async () => {
  const AppWrapper = createAppWrapper();
  const imageArea = renderer
    .create(
      <AppWrapper>
        <ImageArea />
      </AppWrapper>,
    );

  await act(sleep(100));

  const tree = imageArea.toJSON();

  expect(tree)
    .toMatchSnapshot();
});
