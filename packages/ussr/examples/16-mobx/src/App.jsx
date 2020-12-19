import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from './Connect';
import { useUssrEffect } from '../../../src';

export const App = observer(() => {
  const { helloWorld } = useStore();

  useUssrEffect(async () => {
    await helloWorld.setString();
  });

  return (
    <div>
      <h1>{helloWorld.state}</h1>
    </div>
  );
});
