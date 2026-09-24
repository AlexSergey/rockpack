import { createRoot } from 'react-dom/client';

import add from './add.wasm';
import big from './big.svg';
import data from './data.json';
import Doc from './doc.mdx';
import './fonts.css';
import icon from './icon.svg';
import Logo from './logo.component.svg';
import photo from './photo.png';
import readme from './readme.md';

const App = (): React.JSX.Element => (
  <main>
    <div className="markdown" dangerouslySetInnerHTML={{ __html: readme }} />
    <Doc />
    <Logo className="logo" />
    <img alt="icon" className="icon" src={icon} />
    <img alt="big" className="big" src={big} />
    <img alt="photo" className="photo" src={photo} />
    <span className="answer">{data.answer}</span>
  </main>
);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}

// Lets the test call the wasm module from the page.
(window as unknown as { fixtureSum: (a: number, b: number) => Promise<number> }).fixtureSum = async (a, b) => {
  const { instance } = await add();

  return (instance.exports as { add: (x: number, y: number) => number }).add(a, b);
};
