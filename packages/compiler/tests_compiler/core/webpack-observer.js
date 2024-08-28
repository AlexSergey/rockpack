class WebpackObserver {
  constructor({ end, onError, onFinished }) {
    this.onError = onError;
    this.onFinished = onFinished;
    this.interval = null;
    this.state = 'wait';
    this.end = end;

    this.deadTimer = setTimeout(() => {
      this.destroy();
      this.onError(new Error('Time out'));
    }, this.end);
  }

  destroy() {
    clearInterval(this.interval);
    clearTimeout(this.deadTimer);
  }

  run(delay) {
    this.interval = setInterval(() => {
      // eslint-disable-next-line default-case
      switch (this.state) {
        case 'done':
          this.destroy();
          this.onFinished();
          break;

        case 'fail':
          this.destroy();
          this.onError(new Error('Compile failure'));
          break;
      }
    }, delay);
  }

  setState(state) {
    this.state = state;
  }
}

module.exports = WebpackObserver;
