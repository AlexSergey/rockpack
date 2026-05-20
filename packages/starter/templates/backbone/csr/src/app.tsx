import type { ReactElement } from 'react';

import { Head } from '@unhead/react';

import './styles/tokens.css';
import { Description } from './components/description/description.component';
import Logo from './components/logo/logo.component.svg';
import { Tags } from './components/tags/tags.component';
import { useRockpack } from './hooks/rockpack-description.hooks';

export const App = (): ReactElement => {
  const [loading, error, description] = useRockpack();

  return (
    <>
      <Head>
        <title>Rockpack</title>
        <meta content={description} name="description" />
      </Head>

      <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-950 px-6">
        <div className="flex justify-center">
          <div className="w-128">
            <Logo />
          </div>
        </div>

        <Description error={error} loading={loading} text={description} />

        <Tags />

        <a
          className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
          href="https://github.com/AlexSergey/rockpack"
          rel="noopener noreferrer"
          target="_blank"
        >
          Read Documentation →
        </a>
      </div>
    </>
  );
};
