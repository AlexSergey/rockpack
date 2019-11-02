const defaultProps = {
    dist: 'dist',
    src: 'src/index',
    url: '/',
    debug: false,
    stats: false,
    write: false,
    base64: true,
    html: true,
    analyzerPort: false, //port number, for example: 8888
    server: {
        browserSyncPort: false,
        port: 3000,
        host: 'localhost'
    }
    /*
    Other Props:
    * tsconfig: path to tsconfig
    * nodemon: path to nodemon run file
    * dotenv: 'path_to_dotend or put .env file to your project',
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
