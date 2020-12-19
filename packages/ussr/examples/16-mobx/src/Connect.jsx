import React from 'react'
import { useLocalObservable } from 'mobx-react'
import { createHelloWorldStore } from './store';

const storeContext = React.createContext(null);

export const CreateStoreProvider = (initialState = {
  helloWorld: {}
}) => {
  let api = {};

  const StoreProvider = ({ children }) => {
    const store = !api.getStore ? {
      helloWorld: useLocalObservable(createHelloWorldStore(initialState.helloWorld))
    } : api.getStore();

    api.getStore = () => store;

    return <storeContext.Provider value={store}>{children}</storeContext.Provider>
  };
  return { StoreProvider, api };
}

export const useStore = () => {
  const store = React.useContext(storeContext)
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store
}
