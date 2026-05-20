import type { ReactElement } from 'react';

interface SpotlightSectionProps {
  readonly badge: string;
  readonly description: string;
  readonly points: readonly string[];
  readonly reversed?: boolean;
  readonly title: string;
  readonly visual: ReactElement;
}

export const SpotlightSection = ({
  badge,
  description,
  points,
  reversed = false,
  title,
  visual,
}: SpotlightSectionProps): ReactElement => (
  <section className="border-t border-slate-800 py-20">
    <div className={`flex flex-col gap-12 lg:flex-row lg:items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
      <div className="flex-1">
        <span className="mb-4 inline-block rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-cyan-400">
          {badge}
        </span>
        <h2 className="mb-4 text-3xl font-bold leading-snug text-white">{title}</h2>
        <p className="mb-6 text-base leading-relaxed text-slate-400">{description}</p>
        <ul className="space-y-2.5">
          {points.map((point) => (
            <li className="flex items-start gap-2.5 text-sm text-slate-400" key={point}>
              <span className="mt-0.5 text-cyan-400">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">{visual}</div>
    </div>
  </section>
);
