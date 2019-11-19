import React from 'react';

import Link from './Link';

describe('Link', () => {
    it('should render correctly', () => {
        const output = shallow(
            <Link title="mockTitle" url="mockUrl" />
        );
        expect(shallowToJson(output)).toMatchSnapshot();
    });
});
