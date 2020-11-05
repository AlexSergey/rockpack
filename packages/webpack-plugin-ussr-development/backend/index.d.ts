declare module 'nodemon-webpack-plugin' {
  import { Settings } from 'nodemon';
  import { Plugin } from 'webpack';

  /**
   * Uses Nodemon to watch and restart your module's output file (presumably a
   * server), but only when webpack is in watch mode (ie, --watch).
   *
   * Saves the need for installing, configuring and running Nodemon as a
   * separate process.
   */
  export default class NodemonPlugin extends Plugin {
    constructor(opts?: Settings);
  }
}
