import type { ReactElement } from 'react';

interface DescriptionProps {
  readonly error: boolean;
  readonly loading: boolean;
  readonly text: string;
}

export const Description = ({ error, loading, text }: DescriptionProps): ReactElement => {
  if (loading) {
    return <div className="mx-auto h-4 w-72 animate-pulse rounded-full bg-slate-800" />;
  }

  if (error) {
    return <p className="text-sm text-red-400">Failed to load description</p>;
  }

  return <p className="max-w-sm text-base leading-relaxed text-slate-400">{text}</p>;
};
