import React from 'react';
import { renderToString } from 'react-dom/server';
import createUssr from './Ussr';

interface StateInterface {
  [key: string]: unknown;
}

interface ServerRenderResult {
  html: string;
  state: StateInterface;
}

export const serverRender = async (
  iteration: (count?: number) => JSX.Element,
  outsideEffects?: Function
): Promise<ServerRenderResult> => {
  const [Ussr, getState, effectCollection, resetIds] = createUssr({ });
  const renderNested = async (): Promise<string> => {
    const App = await iteration();

    const _html = renderToString((
      <Ussr>
        {App}
      </Ussr>
    ));

    resetIds();

    const waited = effectCollection.getWaited();

    if (typeof outsideEffects === 'function') {
      await outsideEffects();
    }

    if (waited.length === 0) {
      return _html;
    }

    if (waited.length > 0) {
      await effectCollection.runEffects();

      return await renderNested();
    }

    return _html;
  };

  const html = await renderNested();

  return {
    html,
    state: getState()
  };
};
