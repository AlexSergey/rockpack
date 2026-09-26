import type { InternalCompilerConf } from '../../types.js';

// The extracted stylesheet: conf.styles when it names a .css file, css/styles.css otherwise.
export const stylesFilename = (conf: InternalCompilerConf): string =>
  typeof conf.styles === 'string' && conf.styles.includes('.css') ? conf.styles : 'css/styles.css';
