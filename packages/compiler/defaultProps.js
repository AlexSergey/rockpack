const defaultProps = {
  dist: 'dist',
  src: 'src/index',
  debug: false,
  write: false,
  html: true,
  analyzerPort: false, //port number, for example: 8888
  server: 3000
  /*
  Other Props:
  * tsconfig: path to tsconfig
  * nodemon: path to nodemon run file
  * version: true,
  * styles: String,
  * vendor: Array, // Array of dependency libraries
  * html: { // You can also add array for multi-pages support
  *     title: String,
  *     favicon: ...,
  *     version: Boolean,
  *     template: String, path to file
  * }
  * banner: String,
  * global: {
  *     key: value
  * },
  * copy: {from: ... to: ...} || [] || {files: [], opts: {}}
  * */
};

module.exports = defaultProps;
