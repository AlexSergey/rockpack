const SSRBackend = require('./backend');
const SSRFrontend = require('./frontend');

const createSSRObserver = () => {
  const state = {
    back: false,
    front: false,
    stats: false,
    compiler: false,
    instance: false
  };

  setInterval(() => {
    if (state.front && state.back) {
      state.front = false;
      state.back = false;
      if (state.instance && state.stats && state.compiler) {
        state.instance.options.liveReload = true;
        state.stats.hash = `${Math.random()}`;
        state.instance.emit('done', state.stats, state.compiler);
        state.instance.options.liveReload = false;
      }
      state.stats = false;
      state.compiler = false;
    }
  }, 100);

  global.__SSR_OBSERVER__ = {
    register: (inst) => {
      state.instance = inst;
    },

    backendChanged: () => {
      state.back = true;
    },

    frontendChanged: (stats, compiler) => {
      state.front = true;
      state.stats = stats;
      state.compiler = compiler;
    },
  };

  return {
    SSRBackend,
    SSRFrontend
  };
};

createSSRObserver.SSRBackend = SSRBackend;
createSSRObserver.SSRFrontend = SSRFrontend;

module.exports = createSSRObserver;
