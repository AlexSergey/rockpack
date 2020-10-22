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
  () => void
];

interface UssrContextInterface {
  isLoading: () => boolean;
  initState: InitStateInterface | {};
  effectCollection: EffectCollection;
  getState: () => StateInterface;
  getId: () => number;
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

const OnComplete = ({ loading, onLoad, onUnmount }): JSX.Element => {
  useEffect(() => {
    if (!isBackend() && loading) {
      setTimeout(() => onLoad(false));
    }
    return onUnmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const createUssr = (initState: InitStateInterface = {}, options: OptionsInterface = {}): ReturnCreateUssr => {
  const app = {
    loading: options.onlyClient ? false : !isBackend(),
    state: initState,
    id: 0
  };
  const effectCollection = new EffectCollection();

  const onLoad = (state): void => {
    app.loading = state;
  };

  const getId = (): number => app.id++;

  const resetId = (): void => {
    app.id = 0;
  };

  const isLoading = (): boolean => app.loading;

  const getState = (): StateInterface => clone(app.state);

  return [
    ({ children }): JSX.Element => (
      <UssrContext.Provider value={{
        isLoading,
        initState,
        effectCollection,
        getState,
        getId
      }}
      >
        {children}
        <OnComplete
          loading={app.loading}
          onLoad={onLoad}
          onUnmount={resetId}
        />
      </UssrContext.Provider>
    ),
    getState,
    effectCollection,
    resetId
  ];
};

export default createUssr;
