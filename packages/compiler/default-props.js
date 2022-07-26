const defaultProps = {
  debug: false,
  dist: 'dist/index.js',
  html: true,
  port: 3000,
  src: 'src/index',
  /*
  Other Props:
  * version: true,
  * styles: String,
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
