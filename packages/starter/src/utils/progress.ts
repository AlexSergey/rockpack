type Spinner = {
  stop: () => void;
  text: string;
};

// Shows the first message, moves to the next one every interval and stays on the last one.
// The returned function stops both the timer and the spinner.
export const startProgress = (spinner: Spinner, messages: readonly string[], intervalMs: number): (() => void) => {
  const [first = '', ...next] = messages;
  spinner.text = first;

  const timer = setInterval(() => {
    const message = next.shift();
    if (message === undefined) {
      clearInterval(timer);

      return;
    }
    spinner.text = message;
  }, intervalMs);

  return (): void => {
    clearInterval(timer);
    spinner.stop();
  };
};
