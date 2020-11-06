import React from 'react';
import Wrapper from './CompWrapper';
import A from './CompA';
import B from './CompB';
import C from './CompC';

export const App = () => (
  <Wrapper>
    <A>
      <B />
    </A>
    <C />
  </Wrapper>
);
