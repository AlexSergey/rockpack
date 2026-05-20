import type { ReactElement } from 'react';

interface FeatureCardProps {
  readonly description: string;
  readonly icon: string;
  readonly title: string;
}

export const FeatureCard = ({ description, icon, title }: FeatureCardProps): ReactElement => (
  <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 transition-colors duration-150 hover:border-slate-700">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-base">
      {icon}
    </div>
    <h3 className="mb-1 text-sm font-semibold text-slate-100">{title}</h3>
    <p className="text-sm leading-relaxed text-slate-500">{description}</p>
  </div>
);
