const defaultProps = {
  dist: 'dist',
  src: 'src/index',
  debug: false,
  html: true,
  port: 3000
  /*
  Other Props:
  * version: true,
  * styles: String,
  * vendor: Array, // Array of dependency libraries
  * html: { // You can also add array for multi-pages support
  *   title: String,
  *   favicon: ...,
  *   version: Boolean,
  *   template: String, path to file
  * }
  * banner: String,
  * global: {
  *   key: value
  * },
  * copy: {from: ... to: ...} || [] || {files: [], opts: {}}
  * */
};

module.exports = defaultProps;
