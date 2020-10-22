class WebpackObserver {
  constructor({
    onError,
    onFinished,
    end
  }) {
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

  run(delay) {
    this.interval = setInterval(() => {
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

  destroy() {
    clearInterval(this.interval);
    clearTimeout(this.deadTimer);
  }
}

module.exports = WebpackObserver;
