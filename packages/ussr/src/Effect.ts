export enum Statuses {
  wait = 'wait',
  done = 'done',
}

export interface EffectInterface {
  id: string;
  status: Statuses;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: any;
}

interface EffectOptions {
  id: string;
}

class Effect {
  private id: string;

  private status: Statuses;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private callback?: any;

  constructor({ id }: EffectOptions) {
    this.id = id;
    this.status = Statuses.wait;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCallback(cb: any): void {
    if (this.status === Statuses.wait) {
      this.callback = cb;
    }
  }

  getStatus = (): Statuses => this.status;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCallback = (): any => this.callback;

  done = (): void => {
    this.status = Statuses.done;
  };

  getId = (): string => this.id;

  install = (effect: (resolve: (data?: unknown) => void) => unknown, cb?: Function) => (): Promise<unknown | void> => (
    new Promise(resolve => effect(resolve))
      .then((d) => {
        if (typeof cb === 'function') {
          // eslint-disable-next-line promise/no-callback-in-promise
          cb(d);
        }
        return d;
      })
  );
}

export { Effect };
