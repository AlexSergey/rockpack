import { observable, action } from 'mobx';

export const createHelloWorldStore = (initialState) => () => ({
  @observable state: typeof initialState === 'string' ? initialState : 'None',

  @action setString() {
    return new Promise((resolve) => setTimeout(() => {
      this.state = 'Hello world';
      resolve();
    }, 1000))
  }
});
