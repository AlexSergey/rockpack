/**
 * @jest-environment node
 */
import React from 'react';
import { shallow } from 'enzyme';
import { useUssrState, useUssrEffect } from './hooks';
import createUssr from './Ussr';

describe('hooks tests', () => {
  test('useWillMount - Basic load on ready', async () => {
    const [Ussr, ,effectCollection] = createUssr();
    let called = false;

    const App = (): JSX.Element => {
      useUssrEffect(() => (
        new Promise(resolve => {
          setTimeout(() => {
            called = true;
            resolve();
          }, 500);
        })
      ), 'effect-0');

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
      'custom-id': 'bar'
    });

    const App = (): JSX.Element => {
      const [state] = useUssrState('', 'custom-id');

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
      const [state, setState] = useUssrState('', 'state-0');

      useUssrEffect(() => (
        new Promise(resolve => {
          setTimeout(() => {
            setState('async bar');
            resolve();
          }, 500);
        })
      ), 'effect-0');

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
    const state = getState();

    const key = Object.keys(state)[0];

    expect(state).toStrictEqual({ [key]: 'async bar' });
  });
});
