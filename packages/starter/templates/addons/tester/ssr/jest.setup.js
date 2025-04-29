require('@testing-library/jest-dom');

window.MessageChannel = jest.fn().mockImplementation(() => {
  let onmessage;
  return {
    port1: {
      set onmessage(cb) {
        onmessage = cb;
      },
    },
    port2: {
      postMessage: data => {
        onmessage?.({ data });
      },
    },
  };
});
