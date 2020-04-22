import React from 'react';
import { renderToString } from 'react-dom/server';
import createUssr from './Ussr';

interface StateInterface {
  [key: string]: unknown;
}

interface RenderUssrInterface {
  render: () => JSX.Element;
  onBeforeEffects?: () => Promise<unknown>;
  onAfterEffects?: (state: StateInterface) => Promise<unknown>;
}

interface RenderUssrReturnInterface {
  html: string;
  state: StateInterface;
}

export const serverRender = async ({
  render,
  onBeforeEffects,
  onAfterEffects
}: RenderUssrInterface): Promise<RenderUssrReturnInterface> => {
  const [runEffects, UssrRunEffects] = createUssr({});

  renderToString(
    <UssrRunEffects>
      {render()}
    </UssrRunEffects>
  );

  if (typeof onBeforeEffects === 'function') {
    await onBeforeEffects();
  }

  const state = await runEffects();

  if (typeof onAfterEffects === 'function') {
    await onAfterEffects(state);
  }

  const [, Ussr] = createUssr(state, {
    ignoreWillMount: true
  });

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
