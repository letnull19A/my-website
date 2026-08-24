import React from 'react';

export interface CaseMeta {
  role?: string;
  duration?: string;
  status?: string;
  stack?: string;
}

export interface CaseMetaGridProps {
  meta?: CaseMeta;
  title?: string;
  className?: string;
}

export const CaseMetaGrid: React.FC<CaseMetaGridProps> = ({
  meta,
  title = 'ABOUT.',
  className = '',
}) => {
  if (!meta) return null;

  const items = [
    { label: 'Role', value: meta.role },
    { label: 'Duration', value: meta.duration },
    { label: 'Status', value: meta.status },
    { label: 'Stack', value: meta.stack },
  ].filter((item) => Boolean(item.value));

  return (
    <section
      id='about'
      className={`flex flex-col gap-4 border-border border-b border-t py-6 px-4 sm:px-6 md:px-8 ${className}`}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-lime-light uppercase">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.045) 2px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 2px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
            }}
            className="p-4 sm:p-5 flex flex-col justify-between bg-card border border-border min-w-0"
          >
            <span className="text-xs sm:text-sm uppercase tracking-wider text-lime mb-2 block font-medium">
              {item.label}
            </span>
            <span className="text-sm sm:text-base md:text-lg font-bold text-lime-light tracking-wide break-words leading-snug">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};