import { motion } from 'framer-motion';
import { ReactNode, useRef } from 'react';

type Tab = { id: string; label: string; icon: ReactNode; };

export function IconTabs({
  tabs, value, onChange
}: { tabs: Tab[]; value: string; onChange: (v: string) => void; }) {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex justify-center">
      <div
        role="tablist"
        aria-label="Dashboard sections"
        ref={listRef}
        className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white/70 p-1 backdrop-blur
                   dark:border-slate-800 dark:bg-slate-900/60"
      >
        {tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
                ${active
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
            >
              {active && (
                <motion.span
                  layoutId="tab-active-bg"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: '#71f278' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative z-10">{t.icon}</span>
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
