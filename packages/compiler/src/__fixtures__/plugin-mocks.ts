// Recording stand-ins for webpack plugins: each instance keeps its plugin name and constructor arguments.
// Use them from jest.mock factories: jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js')

export type RecordedPlugin = {
  readonly args: unknown[];
  readonly pluginName: string;
};

export type RecordingPluginClass = new (...args: unknown[]) => RecordedPlugin;

export const createPluginMock = (pluginName: string): RecordingPluginClass =>
  class {
    readonly args: unknown[];
    readonly pluginName = pluginName;

    constructor(...args: unknown[]) {
      this.args = args;
    }
  };

export const getPluginOptions = (plugin: unknown): unknown => (plugin as RecordedPlugin).args[0];
