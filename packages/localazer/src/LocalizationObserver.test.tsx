import React, { useContext } from 'react';
import Jed from 'jed';
import { mount } from 'enzyme';
import LocalizationObserver, { useI18n, LocalizationObserverContext } from './LocalizationObserver';

let i18n;
let ctx;

beforeAll(() => {
  const App = () => {
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
  it('useI18n should provide Jed instance', () => {
    expect(i18n instanceof Jed)
      .toBe(true);
  });
});

describe('Check LocalizationObserver context provider', () => {
  it('LocalizationObserver should provide 3 methods', () => {
    expect(Object.keys(ctx))
      .toStrictEqual(['attachComponent', 'detachComponent', 'getI18n']);
  });

  it('LocalizationObserver should provide attachComponent method', () => {
    expect(typeof ctx.attachComponent === 'function')
      .toBe(true);
  });

  it('LocalizationObserver should provide detachComponent method', () => {
    expect(typeof ctx.detachComponent === 'function')
      .toBe(true);
  });

  it('LocalizationObserver should provide getI18n method', () => {
    expect(typeof ctx.getI18n === 'function')
      .toBe(true);
  });
});
