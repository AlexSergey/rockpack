/**
 * @jest-environment node
 */
import React from 'react';
import { shallow } from 'enzyme';
import { useUssrState, useWillMount, useUssrEffect } from './hooks';
import createUssr from './Ussr';

describe('hooks tests', () => {
  test('useWillMount - Basic load on ready', async () => {
    const [Ussr, ,effectCollection] = createUssr();
    let called = false;

    const App = (): JSX.Element => {
      const effect = useUssrEffect('test');
      useWillMount(effect, () => (
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

    await effectCollection.runEffects();

    expect(called).toBe(true);
  });

  test('useUssrState - Load state by source', async () => {
    const [Ussr] = createUssr({
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

  test('useUssrState - use setState isomorphic', async () => {
    const [Ussr, getState, effectCollection] = createUssr();

    const App = (): JSX.Element => {
      const [state, setState] = useUssrState('app.foo', '');
      const effect = useUssrEffect('test');
      useWillMount(effect, () => (
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

    await effectCollection.runEffects();

    expect(getState()).toStrictEqual({
      app: {
        foo: 'async bar'
      }
    });
  });

  test('effect install test', async () => {
    const [Ussr, getState, effectCollection] = createUssr();

    // eslint-disable-next-line sonarjs/no-identical-functions
    const someFn = (setState, resolve): void => {
      setTimeout(() => {
        setState('async bar');
        resolve();
      }, 500);
    };

    const App = (): JSX.Element => {
      const [state, setState] = useUssrState('app.foo', '');
      const effect = useUssrEffect('test');
      useWillMount(effect, effect.install((resolve) => {
        someFn(setState, resolve);
      }));

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

    await effectCollection.runEffects();

    expect(getState())
      .toStrictEqual({
        app: {
          foo: 'async bar'
        }
      });
  });
});
