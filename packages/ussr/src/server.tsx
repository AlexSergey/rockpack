import React from 'react';
import { renderToString } from 'react-dom/server';
import createUssr from './Ussr';

interface StateInterface {
  [key: string]: unknown;
}

type Middleware = (callbacks: Promise<unknown>[]) => Promise<unknown>[] | undefined;

interface ServerRenderResult {
  html: string;
  state: StateInterface;
}

export const serverRender = async (
  iteration: (count?: number) => JSX.Element,
  middleware?: Middleware): Promise<ServerRenderResult> => {
  let count = 0;
  const [runEffects, Ussr, getEffects, getSate] = createUssr({ });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderNested = async (): Promise<string> => {
    count++;
    const App = await iteration(count);
    const _html = renderToString((
      <Ussr>
        {App}
      </Ussr>
    ));

    const effects = getEffects();

    const waited = effects.filter(effect => effect.status === 'wait');

    const callbacks = await (async (callbackFunctions): Promise<Promise<unknown>[]> => {
      const finalCallbacks = typeof middleware === 'function' ? middleware(callbackFunctions) : callbackFunctions;
      return Array.isArray(finalCallbacks) ? finalCallbacks : callbackFunctions;
    })(waited.map(e => e.callback));

    if (callbacks.length > 0) {
      await runEffects(callbacks, waited);

      return await renderNested();
    }
    return _html;
  };
  const html = await renderNested();

  return {
    html,
    state: getSate()
  };
};
