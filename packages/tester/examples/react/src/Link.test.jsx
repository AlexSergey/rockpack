import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Link from './Link';

describe('Link', () => {
  test('should render correctly', () => {
    const tree = renderer
      .create(
        <Link title="mockTitle" url="mockUrl" />
      ).toJSON();

    expect(tree)
      .toMatchSnapshot();
  });
});
