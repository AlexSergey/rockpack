/**
 * @jest-environment node
 */
import React from 'react';
import { serverRender } from './server';
import { useUssrState, useUssrEffect } from './hooks';

describe('server render tests', () => {
  test('pure state', async () => {
    const App = (): JSX.Element => {
      const [state, setState] = useUssrState('app.foo', '');

      useUssrEffect(() => (
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

    const outsideEffect = (): Promise<void> => (
      new Promise(resolve => {
        setTimeout(() => {
          called = true;
          resolve();
        }, 500);
      })
    );

    const externalCallback = async (): Promise<void> => {
      if (!called) {
        await outsideEffect();
      }
    };

    // eslint-disable-next-line sonarjs/no-identical-functions
    const App = (): JSX.Element => {
      const [state, setState] = useUssrState('app.foo', '');

      // eslint-disable-next-line sonarjs/no-identical-functions
      useUssrEffect(() => (
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
