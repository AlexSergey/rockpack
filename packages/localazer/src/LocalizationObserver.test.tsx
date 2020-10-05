import React, { useContext } from 'react';
import { mount } from 'enzyme';
import LocalizationObserver, { LocalizationObserverContext } from './LocalizationObserver';

let ctx;

beforeAll(() => {
  const App = (): JSX.Element => {
    ctx = useContext(LocalizationObserverContext);

    return null;
  };

  mount(
    <LocalizationObserver>
      <App />
    </LocalizationObserver>
  );
});

describe('Check LocalizationObserver context provider', () => {
  test('LocalizationObserver should provide 3 methods', () => {
    expect(Object.keys(ctx))
      .toStrictEqual(['attachComponent', 'detachComponent']);
  });

  test('LocalizationObserver should provide attachComponent method', () => {
    expect(typeof ctx.attachComponent === 'function')
      .toBe(true);
  });

  test('LocalizationObserver should provide detachComponent method', () => {
    expect(typeof ctx.detachComponent === 'function')
      .toBe(true);
  });
});
