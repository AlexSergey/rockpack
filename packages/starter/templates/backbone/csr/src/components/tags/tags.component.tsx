import type { ReactElement } from 'react';

const TAGS = ['Zero config', 'React 19', 'TypeScript', 'SSR', 'AI-ready', 'MIT'] as const;

export const Tags = (): ReactElement => (
  <div className="flex flex-wrap justify-center gap-2">
    {TAGS.map((tag) => (
      <span className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400" key={tag}>
        {tag}
      </span>
    ))}
  </div>
);
