/**
 * @jest-environment node
 */
import React from 'react';
import { serverRender } from './server';
import { useWillMount, useUssrState } from './hooks';

describe('server render tests', () => {
  test('pure state', async () => {
    const App = (): JSX.Element => {
      const [state, setState] = useUssrState('app.foo', '');
      useWillMount(() => (
        new Promise(resolve => {
          setTimeout(() => {
            setState('test bar');
            resolve();
          }, 500);
        })
      ));
      return (
        <div>{state}</div>
      );
    };

    const { html, state } = await serverRender(() => (
      <App />
    ));

    expect(html)
      .toBe('<div>test bar</div>');
    expect(state)
      .toStrictEqual({ app: { foo: 'test bar' } });
  });

  test('pure state and external callback', async () => {
    let called = false;

    const externalCallback = (callbackFunctions): void => {
      if (!called) {
        callbackFunctions.push(
          new Promise(resolve => {
            setTimeout(() => {
              called = true;
              resolve();
            }, 500);
          })
        );
      }
    };

    // eslint-disable-next-line sonarjs/no-identical-functions
    const App = (): JSX.Element => {
      const [state, setState] = useUssrState('app.foo', '');

      // eslint-disable-next-line sonarjs/no-identical-functions
      useWillMount(() => (
        // eslint-disable-next-line sonarjs/no-identical-functions
        new Promise(resolve => {
          setTimeout(() => {
            setState('test bar');
            resolve();
          }, 500);
        })
      ));
      return (
        <div>{state}</div>
      );
    };

    const { html, state } = await serverRender(() => (
      <App />
    ), externalCallback);


    expect(called)
      .toBe(true);
    expect(html)
      .toBe('<div>test bar</div>');
    expect(state)
      .toStrictEqual({ app: { foo: 'test bar' } });
  });
});
