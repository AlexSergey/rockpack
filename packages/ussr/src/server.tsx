import React from 'react';
import { renderToString } from 'react-dom/server';
import createUssr from './Ussr';

interface StateInterface {
  [key: string]: unknown;
}

type Middleware = () => any;

interface ServerRenderResult {
  html: string;
  state: StateInterface;
}

export const serverRender = async (
  iteration: (count?: number) => JSX.Element,
  middleware?: Middleware
): Promise<ServerRenderResult> => {
  let count = 0;
  const [Ussr, getState, effectCollection] = createUssr({ });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderNested = async (): Promise<string> => {
    count++;
    const App = await iteration(count);
    const _html = renderToString((
      <Ussr>
        {App}
      </Ussr>
    ));

    const waited = effectCollection.getWaited();

    if (typeof middleware === 'function') {
      await middleware();
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
