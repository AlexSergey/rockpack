import React, { useContext } from 'react';
import Jed from 'jed';
import { mount } from 'enzyme';
import LocalizationObserver, { useI18n, LocalizationObserverContext } from './LocalizationObserver';

let i18n;
let ctx;

beforeAll(() => {
  const App = (): JSX.Element => {
    i18n = useI18n();
    ctx = useContext(LocalizationObserverContext);

    return null;
  };

  mount(
    <LocalizationObserver>
      <App />
    </LocalizationObserver>
  );
});

describe('Check LocalizationObserver hook', () => {
  test('useI18n should provide Jed instance', () => {
    expect(i18n instanceof Jed)
      .toBe(true);
  });
});

describe('Check LocalizationObserver context provider', () => {
  test('LocalizationObserver should provide 3 methods', () => {
    expect(Object.keys(ctx))
      .toStrictEqual(['attachComponent', 'detachComponent', 'getI18n']);
  });

  test('LocalizationObserver should provide attachComponent method', () => {
    expect(typeof ctx.attachComponent === 'function')
      .toBe(true);
  });

  test('LocalizationObserver should provide detachComponent method', () => {
    expect(typeof ctx.detachComponent === 'function')
      .toBe(true);
  });

  test('LocalizationObserver should provide getI18n method', () => {
    expect(typeof ctx.getI18n === 'function')
      .toBe(true);
  });
});
