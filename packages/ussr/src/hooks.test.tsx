/**
 * @jest-environment node
 */
import React from 'react';
import { shallow } from 'enzyme';
import { useUssrState, useWillMount } from './hooks';
import createUssr from './Ussr';

describe('hooks tests', () => {
  it('useWillMount - Basic load on ready', async () => {
    const [runEffects, Ussr, getEffects] = createUssr();
    let called = false;

    const App = (): JSX.Element => {
      useWillMount(() => (
        new Promise(resolve => {
          setTimeout(() => {
            called = true;
            resolve();
          }, 500);
        })
      ));
      return null;
    };

    shallow(
      <Ussr>
        <App />
      </Ussr>
    ).html();

    const effects = getEffects();

    const callbacks = effects
      .filter(effect => effect.status === 'wait')
      .map(e => e.callback);

    await runEffects(callbacks, effects);

    expect(called).toBe(true);
  });

  it('useUssrState - Load state by source', async () => {
    const [, Ussr] = createUssr({
      app: {
        foo: 'bar'
      }
    });

    const App = (): JSX.Element => {
      const [state] = useUssrState('app.foo', '');

      return (
        <div>
          {state}
        </div>
      );
    };

    const result = shallow(
      <Ussr>
        <App />
      </Ussr>
    )
      .html();

    expect(result).toBe('<div>bar</div>');
  });

  it('useUssrState - use setState isomorphic', async () => {
    const [runEffects, Ussr, getEffects, getState] = createUssr();

    const App = (): JSX.Element => {
      const [state, setState] = useUssrState('app.foo', '');

      useWillMount(() => (
        new Promise(resolve => {
          setTimeout(() => {
            setState('async bar');
            resolve();
          }, 500);
        })
      ));

      return (
        <div>
          {state}
        </div>
      );
    };

    shallow(
      <Ussr>
        <App />
      </Ussr>
    )
      .html();

    const effects = getEffects();

    const callbacks = effects
      .filter(effect => effect.status === 'wait')
      .map(e => e.callback);

    await runEffects(callbacks, effects);

    expect(getState()).toStrictEqual({
      app: {
        foo: 'async bar'
      }
    });
  });
});
