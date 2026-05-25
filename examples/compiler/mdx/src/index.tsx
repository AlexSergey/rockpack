import React from 'react';
import { createRoot } from 'react-dom/client';

import { CodeBlock } from './components/code-block';
import Readme from './readme.mdx';

const components = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  code: CodeBlock as any,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement => (
    <h1 style={{ color: 'tomato' }} {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLElement>): React.ReactElement => <div {...props} />,
};

const App: React.FC = () => <Readme components={components} />;

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
