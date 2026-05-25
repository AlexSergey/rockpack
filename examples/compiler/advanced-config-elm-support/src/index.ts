interface ElmApp {
  Main: {
    init: (opts: { flags: number; node: HTMLElement | null }) => void;
  };
}
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const { Elm }: { Elm: ElmApp } = require('./Main');
Elm.Main.init({ flags: 6, node: document.getElementById('root') });
