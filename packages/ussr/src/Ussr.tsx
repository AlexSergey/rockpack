import React, { createContext, useEffect, isValidElement } from 'react';
import EffectCollection from './EffectCollection';
import { isBackend, clone } from './utils';

export interface InitStateInterface {
  [key: string]: unknown;
}

export interface StateInterface {
  [key: string]: unknown;
}

interface OptionsInterface {
  onlyClient?: boolean;
}

type ReturnCreateUssr = [
  ({ children }: { children: JSX.Element }) => JSX.Element,
  () => StateInterface,
  EffectCollection,
];

interface UssrContextInterface {
  isLoading: () => boolean;
  initState: InitStateInterface | {};
  effectCollection: EffectCollection;
  getState: () => StateInterface;
}

type ExcludeFn = (...args: unknown[]) => JSX.Element;

export const UssrContext = createContext<UssrContextInterface>({} as UssrContextInterface);

export const ExcludeUssr = ({ children }: { children: JSX.Element | ExcludeFn }): JSX.Element => (
  isBackend() ?
    null :
    (isValidElement(children) ?
      children :

      (typeof children === 'function' ?
        children() :
        null)
    )
);

const OnComplete = ({ loading, onLoad }): JSX.Element => {
  useEffect(() => {
    if (!isBackend() && loading) {
      setTimeout(() => onLoad(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const createUssr = (initState: InitStateInterface = {}, options: OptionsInterface = {}): ReturnCreateUssr => {
  const app = {
    loading: options.onlyClient ? false : !isBackend(),
    state: initState
  };
  const effectCollection = new EffectCollection();

  const onLoad = (state): void => {
    app.loading = state;
  };

  const isLoading = (): boolean => app.loading;

  const getState = (): StateInterface => clone(app.state);

  return [
    ({ children }): JSX.Element => (
      <UssrContext.Provider value={{
        isLoading,
        initState,
        effectCollection,
        getState
      }}
      >
        {children}
        <OnComplete loading={app.loading} onLoad={onLoad} />
      </UssrContext.Provider>
    ),
    getState,
    effectCollection
  ];
};

export default createUssr;
