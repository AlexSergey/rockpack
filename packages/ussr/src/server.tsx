import React from 'react';
import { renderToString } from 'react-dom/server';
import createUssr from './Ussr';

interface StateInterface {
  [key: string]: unknown;
}

interface RenderUssrInterface {
  render: () => JSX.Element;
}

interface RenderUssrReturnInterface {
  html: string;
  state: StateInterface;
}

export const serverRender = async ({
  render
}: RenderUssrInterface): Promise<RenderUssrReturnInterface> => {
  const [runEffects, UssrRunEffects] = createUssr({});
  
  renderToString(
    <UssrRunEffects>
      {render()}
    </UssrRunEffects>
  );
  const state = await runEffects();
  const [, Ussr] = createUssr(state, true);
  const html = renderToString(
    <Ussr>
      {render()}
    </Ussr>
  );
  return {
    html,
    state
  };
};
